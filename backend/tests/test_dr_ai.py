"""Tests for DR AI ile Uret feature (questions, blueprint, lead, admin, mockup)."""
import os
import requests
import pytest

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://dijital-roket-deploy.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "admin@dijitalroket.com"
ADMIN_PASSWORD = "Roket2026!"

IDEA = "Bayilerimin stok ve ozel fiyat gorup siparis verebilecegi bir B2B sistem istiyorum"


@pytest.fixture(scope="session")
def admin_token():
    r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=30)
    assert r.status_code == 200, f"admin login failed: {r.status_code} {r.text}"
    return r.json()["token"]


@pytest.fixture(scope="session")
def questions_payload():
    r = requests.post(f"{API}/dr-ai/questions", json={"idea": IDEA}, timeout=90)
    assert r.status_code == 200, f"questions failed: {r.status_code} {r.text}"
    return r.json()


@pytest.fixture(scope="session")
def blueprint_payload(questions_payload):
    answers = []
    for q in questions_payload["questions"]:
        ans = (q.get("options") or ["Evet"])[0]
        answers.append({"question": q["question"], "answer": ans})
    r = requests.post(f"{API}/dr-ai/blueprint", json={"idea": IDEA, "answers": answers}, timeout=120)
    assert r.status_code == 200, f"blueprint failed: {r.status_code} {r.text}"
    return {"answers": answers, "blueprint": r.json()["blueprint"]}


# --- Questions ---
def test_questions_shape(questions_payload):
    qs = questions_payload["questions"]
    assert isinstance(qs, list) and 1 <= len(qs) <= 5
    for q in qs:
        assert q.get("id")
        assert isinstance(q.get("question"), str) and len(q["question"].strip()) > 0
        assert isinstance(q.get("options", []), list)


def test_questions_short_idea_400():
    r = requests.post(f"{API}/dr-ai/questions", json={"idea": "a"}, timeout=30)
    assert r.status_code == 400


# --- Blueprint ---
def test_blueprint_shape(blueprint_payload):
    bp = blueprint_payload["blueprint"]
    assert bp["project_name"]
    assert bp["project_type"]
    assert isinstance(bp["target_users"], list)
    assert isinstance(bp["modules"], list) and len(bp["modules"]) > 0
    assert isinstance(bp["admin_features"], list)
    assert bp["platform"]
    assert isinstance(bp["optional_features"], list)
    assert bp["next_step"]


# --- Lead + Admin flow ---
def test_lead_and_admin_flow(blueprint_payload, admin_token):
    lead_body = {
        "idea": IDEA,
        "answers": blueprint_payload["answers"],
        "blueprint": blueprint_payload["blueprint"],
        "mockup_images": [],
        "name": "QA Test Lead",
        "company": "QA Test Co",
        "phone": "+905551112233",
        "email": "qa-test@example.com",
        "note": "automated test lead",
    }
    r = requests.post(f"{API}/dr-ai/lead", json=lead_body, timeout=30)
    assert r.status_code == 200, f"lead create failed: {r.status_code} {r.text}"
    data = r.json()
    assert data.get("ok") is True
    lead_id = data.get("id")
    assert isinstance(lead_id, str) and len(lead_id) > 0

    # admin list
    h = {"Authorization": f"Bearer {admin_token}"}
    r2 = requests.get(f"{API}/admin/ai-leads", headers=h, timeout=30)
    assert r2.status_code == 200, f"admin list failed: {r2.status_code} {r2.text}"
    items = r2.json()
    assert isinstance(items, list)
    found = [it for it in items if it.get("_id") == lead_id or it.get("id") == lead_id]
    assert found, f"created lead {lead_id} not found in admin list"
    it = found[0]
    assert it.get("name") == "QA Test Lead"
    assert it.get("phone") == "+905551112233"

    # admin list without auth -> 401/403
    r_noauth = requests.get(f"{API}/admin/ai-leads", timeout=30)
    assert r_noauth.status_code in (401, 403)

    # delete
    r3 = requests.delete(f"{API}/admin/ai-leads/{lead_id}", headers=h, timeout=30)
    assert r3.status_code == 200

    # verify gone
    r4 = requests.get(f"{API}/admin/ai-leads", headers=h, timeout=30)
    assert r4.status_code == 200
    ids = [it.get("_id") or it.get("id") for it in r4.json()]
    assert lead_id not in ids


def test_lead_missing_fields_400():
    r = requests.post(f"{API}/dr-ai/lead", json={"idea": IDEA, "name": "", "phone": ""}, timeout=30)
    assert r.status_code in (400, 422)


# --- Mockup (slow, may proxy-timeout) ---
def test_mockup_generates_images(blueprint_payload):
    bp = blueprint_payload["blueprint"]
    body = {
        "project_name": bp["project_name"],
        "description": bp.get("description") or "b2b bayi sistemi",
        "project_type": bp["project_type"],
        "modules": bp["modules"][:5],
        "platform": bp["platform"],
    }
    try:
        r = requests.post(f"{API}/dr-ai/mockup", json=body, timeout=240)
    except requests.exceptions.ReadTimeout:
        pytest.skip("Mockup proxy timeout (>240s) - non-blocking per spec")
    if r.status_code == 504:
        pytest.skip("Mockup gateway timeout - non-blocking")
    assert r.status_code == 200, f"mockup failed: {r.status_code} {r.text[:300]}"
    data = r.json()
    imgs = data.get("images") or []
    assert len(imgs) >= 1
    for u in imgs:
        assert u.startswith("/api/uploads/") and u.endswith(".png")
        # fetch and verify 200
        rr = requests.get(f"{BASE_URL}{u}", timeout=30)
        assert rr.status_code == 200
        assert len(rr.content) > 1000
