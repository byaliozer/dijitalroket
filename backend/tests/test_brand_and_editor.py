"""
Backend tests for new features:
- Editor enhancements (blog + project: tags chip, seo_title, seo_description)
- Brand Management CRUD (admin)
- Brand portal auth, /api/brand/me
- Brand /api/brand/generate error handling (expected 502 due to OpenAI billing) + no credit deduction on failure
- Token isolation: admin token rejected by brand endpoints and vice-versa
"""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
if not BASE_URL:
    fenv = "/app/frontend/.env"
    if os.path.exists(fenv):
        for line in open(fenv):
            if line.startswith("REACT_APP_BACKEND_URL="):
                BASE_URL = line.split("=", 1)[1].strip().rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "admin@dijitalroket.com"
ADMIN_PASSWORD = "Roket2026!"
BRAND_EMAIL = "testmarka@firma.com"
BRAND_PASSWORD = "Marka2026!"


@pytest.fixture(scope="module")
def s():
    sess = requests.Session()
    sess.headers.update({"Content-Type": "application/json"})
    return sess


@pytest.fixture(scope="module")
def admin_headers(s):
    r = s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, r.text
    return {"Authorization": f"Bearer {r.json()['token']}"}


@pytest.fixture(scope="module")
def brand_headers(s):
    r = s.post(f"{API}/brand/login", json={"email": BRAND_EMAIL, "password": BRAND_PASSWORD})
    assert r.status_code == 200, f"Brand login failed: {r.status_code} {r.text}"
    return {"Authorization": f"Bearer {r.json()['token']}"}


# ---------------- Editor enhancements ----------------
class TestBlogEditorFields:
    def test_create_blog_with_tags_and_seo(self, s, admin_headers):
        slug = f"TEST-blog-{uuid.uuid4().hex[:8]}"
        payload = {
            "slug": slug,
            "title": "TEST Blog Title",
            "excerpt": "TEST excerpt",
            "content": "## body\n\n![cover](/uploads/x.png){w=75}",
            "category": "Test",
            "tags": ["ai", "test", "seo"],
            "seo_title": "TEST seo title",
            "seo_description": "TEST seo description for blog",
            "published": True,
        }
        r = s.post(f"{API}/admin/blog", json=payload, headers=admin_headers)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["tags"] == ["ai", "test", "seo"]
        assert data["seo_title"] == "TEST seo title"
        assert data["seo_description"] == "TEST seo description for blog"
        post_id = data["id"]

        # GET verify persistence
        lst = s.get(f"{API}/admin/blog", headers=admin_headers).json()
        found = next((p for p in lst if p["id"] == post_id), None)
        assert found is not None
        assert found["tags"] == ["ai", "test", "seo"]
        assert found["seo_title"] == "TEST seo title"

        # cleanup
        s.delete(f"{API}/admin/blog/{post_id}", headers=admin_headers)


class TestProjectEditorFields:
    def test_create_project_with_tags_and_seo(self, s, admin_headers):
        slug = f"test-proj-{uuid.uuid4().hex[:8]}"
        payload = {
            "slug": slug,
            "title": "TEST Project",
            "client": "TEST client",
            "sector": "Test",
            "tags": ["b2b", "ai"],
            "need": "TEST need",
            "solution": "TEST sol",
            "result": "TEST result",
            "seo_title": "TEST proj seo",
            "seo_description": "TEST proj seo description",
            "published": True,
        }
        r = s.post(f"{API}/admin/projects", json=payload, headers=admin_headers)
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["tags"] == ["b2b", "ai"]
        assert d["seo_title"] == "TEST proj seo"
        assert d["seo_description"] == "TEST proj seo description"
        pid = d["id"]

        lst = s.get(f"{API}/admin/projects", headers=admin_headers).json()
        found = next((p for p in lst if p["id"] == pid), None)
        assert found is not None
        assert found["tags"] == ["b2b", "ai"]
        s.delete(f"{API}/admin/projects/{pid}", headers=admin_headers)


# ---------------- Brand CRUD ----------------
class TestBrandCRUD:
    created_id = None

    def test_list_brands(self, s, admin_headers):
        r = s.get(f"{API}/admin/brands", headers=admin_headers)
        assert r.status_code == 200
        assert isinstance(r.json(), list)
        for b in r.json():
            assert "_id" not in b

    def test_create_brand(self, s, admin_headers):
        slug = f"test-brand-{uuid.uuid4().hex[:6]}"
        email = f"TEST_brand_{uuid.uuid4().hex[:6]}@firma.com"
        payload = {
            "name": "TEST Brand",
            "slug": slug,
            "logo_url": "",
            "brand_url": "",
            "brand_color": "#FF0000",
            "logo_position": "top-left",
            "portal_email": email,
            "portal_password": "Test1234!",
            "credits_total": 5,
        }
        r = s.post(f"{API}/admin/brands", json=payload, headers=admin_headers)
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["name"] == "TEST Brand"
        assert d["logo_position"] == "top-left"
        assert d["credits_total"] == 5
        assert d["credits_used"] == 0
        assert "_id" not in d
        TestBrandCRUD.created_id = d["id"]

    def test_duplicate_email_rejected(self, s, admin_headers):
        # Re-use the brand that exists (testmarka)
        payload = {
            "name": "Dup",
            "slug": f"dup-{uuid.uuid4().hex[:6]}",
            "brand_color": "#000",
            "logo_position": "center",
            "portal_email": BRAND_EMAIL,
            "portal_password": "x1234",
            "credits_total": 1,
        }
        r = s.post(f"{API}/admin/brands", json=payload, headers=admin_headers)
        assert r.status_code == 400

    def test_update_brand_credits(self, s, admin_headers):
        bid = TestBrandCRUD.created_id
        assert bid
        r = s.put(f"{API}/admin/brands/{bid}", json={"credits_total": 10}, headers=admin_headers)
        assert r.status_code == 200, r.text
        assert r.json()["credits_total"] == 10
        # Verify via GET list
        lst = s.get(f"{API}/admin/brands", headers=admin_headers).json()
        found = next((b for b in lst if b["id"] == bid), None)
        assert found["credits_total"] == 10

    def test_brand_generations_endpoint(self, s, admin_headers):
        bid = TestBrandCRUD.created_id
        r = s.get(f"{API}/admin/brands/{bid}/generations", headers=admin_headers)
        assert r.status_code == 200
        body = r.json()
        assert "items" in body and "monthly_summary" in body and "total" in body
        assert isinstance(body["items"], list)
        assert isinstance(body["monthly_summary"], list)

    def test_delete_brand(self, s, admin_headers):
        bid = TestBrandCRUD.created_id
        r = s.delete(f"{API}/admin/brands/{bid}", headers=admin_headers)
        assert r.status_code == 200
        lst = s.get(f"{API}/admin/brands", headers=admin_headers).json()
        assert not any(b["id"] == bid for b in lst)


# ---------------- Brand Portal Auth ----------------
class TestBrandAuth:
    def test_brand_login_success(self, s):
        r = s.post(f"{API}/brand/login", json={"email": BRAND_EMAIL, "password": BRAND_PASSWORD})
        assert r.status_code == 200, r.text
        d = r.json()
        assert "token" in d
        assert d["brand"]["name"]
        assert "credits_remaining" in d["brand"]
        assert "_id" not in d["brand"]

    def test_brand_login_invalid(self, s):
        r = s.post(f"{API}/brand/login", json={"email": BRAND_EMAIL, "password": "wrong"})
        assert r.status_code == 401

    def test_brand_me(self, s, brand_headers):
        r = s.get(f"{API}/brand/me", headers=brand_headers)
        assert r.status_code == 200
        d = r.json()
        for k in ("id", "name", "credits_total", "credits_used", "credits_remaining"):
            assert k in d


# ---------------- Token Isolation ----------------
class TestTokenIsolation:
    def test_admin_token_rejected_by_brand_endpoint(self, s, admin_headers):
        r = s.get(f"{API}/brand/me", headers=admin_headers)
        assert r.status_code == 401

    def test_brand_token_rejected_by_admin_endpoint(self, s, brand_headers):
        r = s.get(f"{API}/admin/brands", headers=brand_headers)
        assert r.status_code == 401


# ---------------- Brand Generate error & credit-not-deducted ----------------
class TestBrandGenerateErrorHandling:
    def test_generate_fails_gracefully_and_no_credit_deducted(self, s, brand_headers):
        # Read credits before
        me_before = s.get(f"{API}/brand/me", headers=brand_headers).json()
        used_before = me_before["credits_used"]
        remaining_before = me_before["credits_remaining"]

        # Skip if brand has no credits to attempt
        if remaining_before == 0:
            pytest.skip("Brand has no credits remaining; gating tested separately")

        r = s.post(
            f"{API}/brand/generate",
            json={"prompt": "TEST modern minimal social post for a corporate brand", "format": "post"},
            headers=brand_headers,
        )
        # Expected 502 due to OpenAI billing block (per problem statement)
        # Accept 200 if billing has been restored; assert no-credit-leak only on failure
        assert r.status_code in (200, 502), f"Unexpected status: {r.status_code} {r.text}"

        me_after = s.get(f"{API}/brand/me", headers=brand_headers).json()
        if r.status_code == 502:
            # Credit must NOT be deducted on failure
            assert me_after["credits_used"] == used_before, (
                f"Credit was deducted on failure! before={used_before} after={me_after['credits_used']}"
            )
        else:
            assert me_after["credits_used"] == used_before + 1

    def test_generate_credit_gating_402(self, s, admin_headers):
        # Create a brand with credits_total=0 and try to generate
        email = f"TEST_zero_{uuid.uuid4().hex[:6]}@firma.com"
        slug = f"test-zero-{uuid.uuid4().hex[:6]}"
        payload = {
            "name": "TEST Zero",
            "slug": slug,
            "brand_color": "#000",
            "logo_position": "center",
            "portal_email": email,
            "portal_password": "Zero1234!",
            "credits_total": 0,
        }
        cr = s.post(f"{API}/admin/brands", json=payload, headers=admin_headers)
        assert cr.status_code == 200, cr.text
        bid = cr.json()["id"]
        try:
            lr = s.post(f"{API}/brand/login", json={"email": email, "password": "Zero1234!"})
            assert lr.status_code == 200
            bh = {"Authorization": f"Bearer {lr.json()['token']}"}
            gr = s.post(f"{API}/brand/generate", json={"prompt": "TEST prompt", "format": "post"}, headers=bh)
            assert gr.status_code == 402, f"Expected 402 Kredi yetersiz, got {gr.status_code} {gr.text}"
            assert "Kredi" in gr.json().get("detail", "")
        finally:
            s.delete(f"{API}/admin/brands/{bid}", headers=admin_headers)
