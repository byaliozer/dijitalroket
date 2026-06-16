"""Tests for Brand Settings, About field, and password change endpoints.

Covers:
- PUT /api/brand/settings (BrandSelfUpdate, including 'about' + logo_position)
- POST /api/brand/change-password (current/new validation + revert)
- POST /api/brand/upload (auth required)
- GET /api/brand/me (about field present in public payload)
- Admin PUT/POST /api/admin/brands with 'about' field persistence
- Token isolation (no-token, admin-token on brand endpoints)
"""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
if not BASE_URL:
    # Fallback to frontend/.env-derived URL only if env var not propagated to pytest process
    try:
        with open("/app/frontend/.env") as f:
            for line in f:
                if line.startswith("REACT_APP_BACKEND_URL="):
                    BASE_URL = line.split("=", 1)[1].strip().rstrip("/")
                    break
    except FileNotFoundError:
        pass

API = f"{BASE_URL}/api"

ADMIN_EMAIL = "admin@dijitalroket.com"
ADMIN_PASSWORD = "Roket2026!"
BRAND_EMAIL = "testmarka@firma.com"
BRAND_PASSWORD = "Marka2026!"


@pytest.fixture(scope="module")
def admin_token():
    r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=30)
    assert r.status_code == 200, f"admin login failed: {r.status_code} {r.text}"
    return r.json()["token"]


@pytest.fixture(scope="module")
def brand_token():
    r = requests.post(f"{API}/brand/login", json={"email": BRAND_EMAIL, "password": BRAND_PASSWORD}, timeout=30)
    assert r.status_code == 200, f"brand login failed: {r.status_code} {r.text}"
    return r.json()["token"]


def _brand_headers(token):
    return {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}


# --- /api/brand/me & token isolation ---------------------------------------
class TestBrandMeAndIsolation:
    def test_brand_me_returns_about_field(self, brand_token):
        r = requests.get(f"{API}/brand/me", headers=_brand_headers(brand_token), timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert "about" in data, "about field should be present in _brand_public payload"
        assert "logo_position" in data
        assert "brand_color" in data
        assert data.get("id")

    def test_brand_settings_requires_token(self):
        r = requests.put(f"{API}/brand/settings", json={"about": "x"}, timeout=15)
        assert r.status_code in (401, 403), f"expected 401/403 without token, got {r.status_code}"

    def test_brand_change_password_requires_token(self):
        r = requests.post(
            f"{API}/brand/change-password",
            json={"current_password": "x", "new_password": "yyyy"},
            timeout=15,
        )
        assert r.status_code in (401, 403)

    def test_brand_upload_requires_token(self):
        r = requests.post(f"{API}/brand/upload", files={"file": ("a.png", b"x", "image/png")}, timeout=15)
        assert r.status_code in (401, 403)

    def test_admin_token_rejected_on_brand_settings(self, admin_token):
        r = requests.put(
            f"{API}/brand/settings",
            json={"about": "blocked"},
            headers={"Authorization": f"Bearer {admin_token}", "Content-Type": "application/json"},
            timeout=15,
        )
        assert r.status_code == 401, f"admin token should be rejected on /brand/settings; got {r.status_code}"


# --- Settings update (about + logo_position) -------------------------------
class TestBrandSettingsUpdate:
    def test_update_about_and_logo_position_persists(self, brand_token):
        # Snapshot current values
        r0 = requests.get(f"{API}/brand/me", headers=_brand_headers(brand_token), timeout=15)
        original = r0.json()
        original_about = original.get("about", "")
        original_pos = original.get("logo_position", "bottom-right")

        new_about = "TEST_ABOUT Tekstil firmasıyız, kumaş ve moda sektöründe çalışıyoruz."
        new_pos = "center" if original_pos != "center" else "top-left"

        r = requests.put(
            f"{API}/brand/settings",
            json={"about": new_about, "logo_position": new_pos},
            headers=_brand_headers(brand_token),
            timeout=15,
        )
        assert r.status_code == 200, r.text
        updated = r.json()
        assert updated["about"] == new_about
        assert updated["logo_position"] == new_pos

        # Verify persistence via GET
        r2 = requests.get(f"{API}/brand/me", headers=_brand_headers(brand_token), timeout=15)
        assert r2.status_code == 200
        fetched = r2.json()
        assert fetched["about"] == new_about
        assert fetched["logo_position"] == new_pos

        # Restore (best-effort) to keep state minimally polluted
        requests.put(
            f"{API}/brand/settings",
            json={"about": original_about, "logo_position": original_pos},
            headers=_brand_headers(brand_token),
            timeout=15,
        )

    def test_update_empty_payload_returns_current(self, brand_token):
        r = requests.put(f"{API}/brand/settings", json={}, headers=_brand_headers(brand_token), timeout=15)
        assert r.status_code == 200
        assert "about" in r.json()


# --- Change password (and revert) ------------------------------------------
class TestBrandChangePassword:
    def test_wrong_current_password_fails(self, brand_token):
        r = requests.post(
            f"{API}/brand/change-password",
            json={"current_password": "WRONG_PASS!", "new_password": "Whatever123!"},
            headers=_brand_headers(brand_token),
            timeout=15,
        )
        assert r.status_code == 400
        assert "Mevcut" in r.text or "hatalı" in r.text.lower()

    def test_change_password_and_revert(self, brand_token):
        temp_pw = "Temp_Marka_2026!"
        # Change
        r = requests.post(
            f"{API}/brand/change-password",
            json={"current_password": BRAND_PASSWORD, "new_password": temp_pw},
            headers=_brand_headers(brand_token),
            timeout=15,
        )
        assert r.status_code == 200, r.text
        assert r.json().get("ok") is True

        # Verify old password no longer works
        r_old = requests.post(f"{API}/brand/login", json={"email": BRAND_EMAIL, "password": BRAND_PASSWORD}, timeout=15)
        assert r_old.status_code in (400, 401), f"old pw should fail; got {r_old.status_code}"

        # Verify new password works
        r_new = requests.post(f"{API}/brand/login", json={"email": BRAND_EMAIL, "password": temp_pw}, timeout=15)
        assert r_new.status_code == 200, r_new.text
        new_token = r_new.json()["token"]

        # Revert back to original password — CRITICAL for downstream tests / future iterations
        r_rev = requests.post(
            f"{API}/brand/change-password",
            json={"current_password": temp_pw, "new_password": BRAND_PASSWORD},
            headers=_brand_headers(new_token),
            timeout=15,
        )
        assert r_rev.status_code == 200, f"REVERT FAILED — brand may be locked out! {r_rev.text}"

        # Final sanity: original password works again
        r_final = requests.post(
            f"{API}/brand/login", json={"email": BRAND_EMAIL, "password": BRAND_PASSWORD}, timeout=15
        )
        assert r_final.status_code == 200, "brand original password not restored!"


# --- Brand upload (auth happy path) ----------------------------------------
class TestBrandUpload:
    def test_upload_png_with_brand_token(self, brand_token):
        # 1x1 transparent PNG
        png_bytes = (
            b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01"
            b"\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\rIDATx\x9cc\xf8\xcf"
            b"\xc0\x00\x00\x00\x03\x00\x01\x00\x18\xdd\x8d\xb4\x00\x00\x00\x00IEND\xaeB`\x82"
        )
        r = requests.post(
            f"{API}/brand/upload",
            files={"file": ("test.png", png_bytes, "image/png")},
            headers={"Authorization": f"Bearer {brand_token}"},
            timeout=20,
        )
        assert r.status_code == 200, r.text
        body = r.json()
        assert body["url"].startswith("/api/uploads/")
        assert body["size"] == len(png_bytes)


# --- Admin: about field on brand create/update -----------------------------
class TestAdminBrandAboutField:
    def test_create_update_brand_with_about(self, admin_token):
        h = {"Authorization": f"Bearer {admin_token}", "Content-Type": "application/json"}
        # Create
        payload = {
            "name": "TEST_AboutBrand",
            "slug": "test-aboutbrand",
            "portal_email": "TEST_about@firma.com",
            "portal_password": "TestPw1!",
            "about": "TEST_ABOUT_INITIAL — gıda sektörü, restoran zinciri.",
            "credits_total": 1,
        }
        r = requests.post(f"{API}/admin/brands", json=payload, headers=h, timeout=15)
        assert r.status_code in (200, 201), r.text
        brand = r.json()
        assert brand.get("about") == payload["about"]
        bid = brand["id"]

        # Update about
        new_about = "TEST_ABOUT_UPDATED — moda butiği, kadın giyim."
        r2 = requests.put(f"{API}/admin/brands/{bid}", json={"about": new_about}, headers=h, timeout=15)
        assert r2.status_code == 200, r2.text
        assert r2.json().get("about") == new_about

        # Verify via list
        r3 = requests.get(f"{API}/admin/brands", headers=h, timeout=15)
        assert r3.status_code == 200
        items = r3.json()
        found = next((b for b in items if b.get("id") == bid), None)
        assert found is not None
        assert found.get("about") == new_about

        # Cleanup
        rd = requests.delete(f"{API}/admin/brands/{bid}", headers=h, timeout=15)
        assert rd.status_code in (200, 204)
