"""
Brand self-registration + admin approval flow tests.

Covers:
- POST /api/brand/register (KVKK/Terms required, duplicate email, pending status)
- POST /api/brand/login (403 for pending/rejected, 200 after approval)
- POST /api/admin/brands/{id}/approve (sets approved + credits; resend skipped gracefully)
- POST /api/admin/brands/{id}/reject (sets rejected)
- Cleanup via DELETE /api/admin/brands/{id}
"""
import os
import time
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL").rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "admin@dijitalroket.com"
ADMIN_PASSWORD = "Roket2026!"
PROTECTED_EMAIL = "testmarka@firma.com"  # MUST NOT be deleted


@pytest.fixture(scope="module")
def admin_token():
    r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=20)
    assert r.status_code == 200, f"Admin login failed: {r.status_code} {r.text}"
    return r.json()["token"]


@pytest.fixture(scope="module")
def admin_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}", "Content-Type": "application/json"}


@pytest.fixture(scope="module")
def created_brand_ids():
    """Collect created TEST brand ids for teardown."""
    ids = []
    yield ids
    # teardown
    try:
        r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=20)
        token = r.json()["token"]
        headers = {"Authorization": f"Bearer {token}"}
        for bid in ids:
            requests.delete(f"{API}/admin/brands/{bid}", headers=headers, timeout=20)
    except Exception as e:
        print(f"Cleanup failed: {e}")


def _unique_email(prefix="qa_reg"):
    return f"{prefix}_{int(time.time()*1000)}_{uuid.uuid4().hex[:6]}@firma.com"


# -------- Registration validation --------

def test_register_rejects_without_kvkk(created_brand_ids):
    payload = {
        "full_name": "QA Test",
        "phone": "05550000000",
        "email": _unique_email("qa_no_kvkk"),
        "password": "Test1234",
        "kvkk_accepted": False,
        "terms_accepted": True,
    }
    r = requests.post(f"{API}/brand/register", json=payload, timeout=20)
    assert r.status_code == 400, f"Expected 400 got {r.status_code}: {r.text}"
    assert "KVKK" in r.text or "Sözleşme" in r.text


def test_register_rejects_without_terms():
    payload = {
        "full_name": "QA Test",
        "phone": "05550000000",
        "email": _unique_email("qa_no_terms"),
        "password": "Test1234",
        "kvkk_accepted": True,
        "terms_accepted": False,
    }
    r = requests.post(f"{API}/brand/register", json=payload, timeout=20)
    assert r.status_code == 400


def test_register_rejects_short_password():
    payload = {
        "full_name": "QA Test",
        "phone": "05550000000",
        "email": _unique_email("qa_shortpw"),
        "password": "a",
        "kvkk_accepted": True,
        "terms_accepted": True,
    }
    r = requests.post(f"{API}/brand/register", json=payload, timeout=20)
    assert r.status_code == 422  # pydantic validation


# -------- Registration success + pending login block + approval flow --------

def test_full_register_pending_approve_login_flow(admin_headers, created_brand_ids):
    email = _unique_email("qa_full")
    password = "Approve123"
    payload = {
        "full_name": "QA Full Flow",
        "phone": "05551112233",
        "email": email,
        "password": password,
        "company_name": "QA Full Marka",
        "brand_url": "https://qa-full.test",
        "instagram": "@qa_full",
        "kvkk_accepted": True,
        "terms_accepted": True,
    }
    r = requests.post(f"{API}/brand/register", json=payload, timeout=20)
    assert r.status_code == 200, f"Register failed: {r.status_code} {r.text}"
    data = r.json()
    assert data.get("ok") is True

    # Find brand id via admin list
    list_r = requests.get(f"{API}/admin/brands", headers=admin_headers, timeout=20)
    assert list_r.status_code == 200
    brands = list_r.json()
    match = next((b for b in brands if b.get("portal_email") == email), None)
    assert match is not None, "Newly registered brand not found in admin list"
    bid = match["id"]
    created_brand_ids.append(bid)

    # Verify pending status & company name + kvkk fields persisted
    assert match["status"] == "pending"
    assert match["name"] == "QA Full Marka"
    assert match.get("full_name") == "QA Full Flow"
    assert match.get("kvkk_accepted") is True
    assert match.get("terms_accepted") is True
    assert match.get("credits_total", 0) == 0

    # Duplicate email -> 400
    dup = requests.post(f"{API}/brand/register", json=payload, timeout=20)
    assert dup.status_code == 400

    # Pending login blocked with 403 + Turkish message
    login_pending = requests.post(f"{API}/brand/login", json={"email": email, "password": password}, timeout=20)
    assert login_pending.status_code == 403
    assert "onay" in login_pending.text.lower()

    # Approve with credits
    approve = requests.post(
        f"{API}/admin/brands/{bid}/approve",
        json={"credits_total": 17},
        headers=admin_headers,
        timeout=30,
    )
    assert approve.status_code == 200, f"Approve failed: {approve.status_code} {approve.text}"
    a = approve.json()
    assert a["status"] == "approved"
    assert a["credits_total"] == 17
    assert a.get("credits_used", 0) == 0

    # GET to verify persistence
    get_r = requests.get(f"{API}/admin/brands", headers=admin_headers, timeout=20)
    fresh = next((b for b in get_r.json() if b["id"] == bid), None)
    assert fresh is not None
    assert fresh["status"] == "approved"
    assert fresh["credits_total"] == 17

    # Login should now succeed
    login_ok = requests.post(f"{API}/brand/login", json={"email": email, "password": password}, timeout=20)
    assert login_ok.status_code == 200, f"Approved login failed: {login_ok.text}"
    body = login_ok.json()
    assert "token" in body
    assert body["brand"]["status"] == "approved"
    assert body["brand"]["credits_total"] == 17
    assert body["brand"]["portal_email" if "portal_email" in body["brand"] else "id"]

    # /brand/me with token works
    me = requests.get(
        f"{API}/brand/me",
        headers={"Authorization": f"Bearer {body['token']}"},
        timeout=20,
    )
    assert me.status_code == 200


# -------- Reject flow --------

def test_register_then_reject_blocks_login(admin_headers, created_brand_ids):
    email = _unique_email("qa_reject")
    password = "Reject123"
    payload = {
        "full_name": "QA Reject",
        "phone": "05559998877",
        "email": email,
        "password": password,
        "kvkk_accepted": True,
        "terms_accepted": True,
    }
    r = requests.post(f"{API}/brand/register", json=payload, timeout=20)
    assert r.status_code == 200

    list_r = requests.get(f"{API}/admin/brands", headers=admin_headers, timeout=20)
    match = next((b for b in list_r.json() if b.get("portal_email") == email), None)
    assert match is not None
    bid = match["id"]
    created_brand_ids.append(bid)
    assert match["status"] == "pending"

    # Reject
    rj = requests.post(f"{API}/admin/brands/{bid}/reject", headers=admin_headers, timeout=20)
    assert rj.status_code == 200
    assert rj.json()["status"] == "rejected"

    # Login blocked 403
    login_r = requests.post(f"{API}/brand/login", json={"email": email, "password": password}, timeout=20)
    assert login_r.status_code == 403
    assert "onayl" in login_r.text.lower() or "ile" in login_r.text.lower()


# -------- Approve unknown id --------

def test_approve_unknown_id_returns_404(admin_headers):
    r = requests.post(
        f"{API}/admin/brands/does-not-exist-xyz/approve",
        json={"credits_total": 5},
        headers=admin_headers,
        timeout=20,
    )
    assert r.status_code == 404


# -------- Protected brand sanity check (must not be touched) --------

def test_protected_brand_login_still_works():
    r = requests.post(
        f"{API}/brand/login",
        json={"email": PROTECTED_EMAIL, "password": "Marka2026!"},
        timeout=20,
    )
    assert r.status_code == 200, f"Protected brand login regressed: {r.text}"
    assert r.json()["brand"]["status"] == "approved"
