"""AI FAQ generation + Blog FAQ + llms-full.txt + Organization ProfessionalService tests."""
import os
import re
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://dijital-roket-deploy.preview.emergentagent.com").rstrip("/")
ADMIN_EMAIL = "admin@dijitalroket.com"
ADMIN_PW = "Roket2026!"


@pytest.fixture(scope="module")
def s():
    return requests.Session()


@pytest.fixture(scope="module")
def admin_token(s):
    r = s.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PW}, timeout=30)
    assert r.status_code == 200, r.text[:300]
    tok = r.json().get("token") or r.json().get("access_token")
    assert tok
    return tok


# --- AI FAQ generation endpoint ---
class TestGenerateFaq:
    def test_generate_faq_admin(self, s, admin_token):
        headers = {"Authorization": f"Bearer {admin_token}"}
        payload = {
            "kind": "project",
            "title": "Test Okul Yazılımı",
            "context": "Sektör: Eğitim. İhtiyaç: okul yönetim yazılımı",
            "count": 3,
        }
        r = s.post(f"{BASE_URL}/api/admin/generate-faq", json=payload, headers=headers, timeout=120)
        assert r.status_code == 200, r.text[:500]
        data = r.json()
        assert "faq" in data
        faq = data["faq"]
        assert isinstance(faq, list) and len(faq) == 3, f"expected 3 items, got {len(faq)}"
        joined = " ".join((it.get("a") or "") for it in faq).lower()
        for it in faq:
            assert it.get("q") and it.get("a")
        assert "dijital roket" in joined, f"Answers should reference Dijital Roket. Got: {joined[:400]}"

    def test_generate_faq_requires_auth(self, s):
        r = s.post(f"{BASE_URL}/api/admin/generate-faq",
                   json={"kind": "project", "title": "X", "context": "", "count": 3}, timeout=30)
        assert r.status_code in (401, 403)


# --- Blog FAQ persistence ---
class TestBlogFaq:
    def test_blog_list_has_faq_field(self, s):
        r = s.get(f"{BASE_URL}/api/blog", timeout=30)
        assert r.status_code == 200
        posts = r.json()
        assert isinstance(posts, list) and len(posts) > 0
        # every post has faq key (list)
        for p in posts:
            assert "faq" in p, f"Post {p.get('slug')} missing faq field"
            assert isinstance(p["faq"], list)
        # at least one post has ~5 FAQs
        counts = [len(p["faq"]) for p in posts]
        assert max(counts) >= 3, f"Expected pre-seeded blog FAQs, counts={counts}"

    def test_blog_faq_items_shape(self, s):
        r = s.get(f"{BASE_URL}/api/blog", timeout=30)
        posts = [p for p in r.json() if p.get("faq")]
        assert posts
        item = posts[0]["faq"][0]
        assert item.get("q") and item.get("a")


# --- llms-full.txt contains FAQ lines for both projects & blogs ---
class TestLlmsFullFaq:
    def test_llms_full_has_project_and_blog_faq(self, s):
        r = s.get(f"{BASE_URL}/api/llms-full.txt", timeout=30)
        assert r.status_code == 200
        assert "text/markdown" in r.headers.get("content-type", "").lower()
        body = r.text
        # Must include blog section and blog FAQ line
        assert "## Blog Yazıları" in body
        # Count SSS lines
        sss_lines = re.findall(r"^- SSS — .+$", body, re.MULTILINE)
        assert len(sss_lines) >= 5, f"Expected multiple SSS lines, got {len(sss_lines)}"
        # We can't easily split project vs blog by regex, but ensure at least one appears
        # after the blog header:
        blog_idx = body.find("## Blog Yazıları")
        project_section = body[:blog_idx]
        blog_section = body[blog_idx:]
        assert "- SSS — " in project_section, "No project FAQ lines"
        assert "- SSS — " in blog_section, "No blog FAQ lines"


# --- Projects still expose faq ---
class TestProjectFaq:
    def test_projects_have_faq(self, s):
        r = s.get(f"{BASE_URL}/api/projects", timeout=30)
        assert r.status_code == 200
        projects = r.json()
        assert isinstance(projects, list) and len(projects) > 0
        counts = [len(p.get("faq") or []) for p in projects]
        assert max(counts) >= 3, f"Expected seeded project FAQs, counts={counts}"
