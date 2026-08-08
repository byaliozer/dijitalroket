"""AEO/GEO backend tests: /api/llms-full.txt, /llms.txt, project FAQ field, admin FAQ CRUD."""
import os
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://dijital-roket-deploy.preview.emergentagent.com').rstrip('/')
FAQ_SLUG = "dr-ai-2026-sosyal-medya-kurallari"


@pytest.fixture(scope="module")
def admin_token():
    r = requests.post(f"{BASE_URL}/api/auth/login",
                      json={"email": "admin@dijitalroket.com", "password": "Roket2026!"})
    assert r.status_code == 200, r.text
    return r.json()["token"]


# ---- /api/llms-full.txt ----
class TestLlmsFullTxt:
    def test_returns_markdown(self):
        r = requests.get(f"{BASE_URL}/api/llms-full.txt")
        assert r.status_code == 200
        ct = r.headers.get("content-type", "")
        assert "text/markdown" in ct, f"content-type={ct}"
        body = r.text
        assert body.lstrip().startswith("# Dijital Roket"), body[:200]
        # services
        assert "Hizmet" in body or "hizmet" in body.lower()

    def test_includes_projects_and_faq(self):
        r = requests.get(f"{BASE_URL}/api/llms-full.txt")
        assert r.status_code == 200
        body = r.text
        # dynamic project heading present
        assert "### " in body, "expected H3 project entries"
        # FAQ line for the seeded project
        assert "- SSS" in body or "SSS —" in body or "SSS -" in body, \
            f"Expected SSS/FAQ line for project {FAQ_SLUG}"


# ---- /llms.txt (frontend static) ----
class TestLlmsTxtStatic:
    def test_static_llms_txt(self):
        # try backend URL first (ingress will hit frontend for non /api paths)
        r = requests.get(f"{BASE_URL}/llms.txt")
        assert r.status_code == 200
        ct = r.headers.get("content-type", "")
        assert "text/" in ct, f"content-type={ct}"
        # ensure not HTML fallback
        assert "<html" not in r.text.lower()[:500], "returned HTML instead of markdown"
        assert "# Dijital Roket" in r.text


# ---- /api/projects FAQ field ----
class TestProjectsFaq:
    def test_projects_list_has_faq_field(self):
        r = requests.get(f"{BASE_URL}/api/projects")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list) and len(data) > 0
        # every project should have faq key (default [])
        for p in data:
            assert "faq" in p, f"missing faq in project {p.get('slug')}"
            assert isinstance(p["faq"], list)

    def test_target_project_has_2_faq(self):
        r = requests.get(f"{BASE_URL}/api/projects/{FAQ_SLUG}")
        assert r.status_code == 200, r.text
        p = r.json()
        assert "faq" in p
        assert len(p["faq"]) >= 2, f"expected >=2 faq items, got {len(p['faq'])}"
        # check the specific question is present
        # faq items use keys q/a
        questions = [f.get("q") or f.get("question", "") for f in p["faq"]]
        assert any("Okul yönetim yazılımını kim yaptırabilir" in q for q in questions), \
            f"expected known question, got {questions}"


# ---- Admin FAQ CRUD roundtrip ----
class TestAdminProjectFaqUpdate:
    def test_update_project_full_object_with_faq(self, admin_token):
        headers = {"Authorization": f"Bearer {admin_token}"}
        # Fetch project
        r = requests.get(f"{BASE_URL}/api/projects/{FAQ_SLUG}")
        assert r.status_code == 200
        proj = r.json()
        pid = proj["id"]
        original_faq = list(proj.get("faq", []))

        # Build a full CaseStudyCreate payload (all fields present)
        payload = {k: v for k, v in proj.items() if k not in ("_id",)}
        # ensure faq gets an extra TEST item then remove it
        test_faq = original_faq + [{"q": "TEST_Q?", "a": "TEST_A"}]
        payload["faq"] = test_faq

        r2 = requests.put(f"{BASE_URL}/api/admin/projects/{pid}", json=payload, headers=headers)
        assert r2.status_code == 200, f"admin update failed: {r2.status_code} {r2.text}"

        # verify persisted
        r3 = requests.get(f"{BASE_URL}/api/projects/{FAQ_SLUG}")
        assert r3.status_code == 200
        got = r3.json().get("faq", [])
        assert any((f.get("q") or f.get("question")) == "TEST_Q?" for f in got), f"faq not persisted: {got}"

        # cleanup - restore original
        payload["faq"] = original_faq
        r4 = requests.put(f"{BASE_URL}/api/admin/projects/{pid}", json=payload, headers=headers)
        assert r4.status_code == 200
