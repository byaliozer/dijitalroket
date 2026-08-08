"""Tests for home company FAQ: settings merge, AI generate (kind=company), settings persist, regressions."""
import os
import requests
import pytest

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://dijital-roket-deploy.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "admin@dijitalroket.com"
ADMIN_PASSWORD = "Roket2026!"


@pytest.fixture(scope="module")
def admin_token():
    r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=30)
    assert r.status_code == 200, r.text
    return r.json()["token"]


@pytest.fixture(scope="module")
def admin_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}"}


class TestSettingsHomeFaq:
    def test_get_settings_has_home_faq_defaults(self):
        r = requests.get(f"{API}/settings", timeout=30)
        assert r.status_code == 200
        data = r.json()
        assert "home_faq" in data, "home_faq missing from settings"
        faq = data["home_faq"]
        assert isinstance(faq, list) and len(faq) == 8, f"Expected 8 default faq items got {len(faq)}"
        for item in faq:
            assert "q" in item and "a" in item
            assert item["q"] and item["a"]
        assert faq[0]["q"] == "Dijital Roket ne iş yapar?"


class TestAdminGenerateCompanyFaq:
    def test_generate_company_faq(self, admin_headers):
        payload = {
            "kind": "company",
            "title": "Dijital Roket Kurumsal SSS",
            "context": "Firma: Dijital Roket, Bursa. Hizmetler: web, yazilim, okul yazilimi",
            "count": 3,
        }
        r = requests.post(f"{API}/admin/generate-faq", headers=admin_headers, json=payload, timeout=90)
        assert r.status_code == 200, r.text
        data = r.json()
        assert "faq" in data
        faq = data["faq"]
        assert isinstance(faq, list) and len(faq) == 3
        joined = " ".join(f"{x.get('q','')} {x.get('a','')}" for x in faq).lower()
        assert "dijital roket" in joined, "Answers should reference Dijital Roket"
        for item in faq:
            assert item.get("q") and item.get("a")


class TestUpdateSettingsPersistsHomeFaq:
    def test_put_settings_persists_home_faq(self, admin_headers):
        # Fetch current
        cur = requests.get(f"{API}/settings", timeout=30).json()
        original = cur.get("home_faq", [])

        # Modify first Q with a marker; keep everything else
        new_faq = [dict(x) for x in original]
        marker = "TEST_MARK Dijital Roket ne iş yapar?"
        new_faq[0]["q"] = marker
        payload = {"home_faq": new_faq}
        r = requests.put(f"{API}/admin/settings", headers=admin_headers, json=payload, timeout=30)
        assert r.status_code == 200, r.text
        # Reload
        reloaded = requests.get(f"{API}/settings", timeout=30).json()
        assert reloaded["home_faq"][0]["q"] == marker

        # Restore original
        restore = requests.put(f"{API}/admin/settings", headers=admin_headers, json={"home_faq": original}, timeout=30)
        assert restore.status_code == 200
        again = requests.get(f"{API}/settings", timeout=30).json()
        assert again["home_faq"][0]["q"] == "Dijital Roket ne iş yapar?"


class TestSeoRegressions:
    def test_robots(self):
        r = requests.get(f"{BASE_URL}/robots.txt", timeout=30)
        assert r.status_code == 200
        assert "User-agent" in r.text

    def test_sitemap_root(self):
        r = requests.get(f"{BASE_URL}/sitemap.xml", timeout=30)
        assert r.status_code == 200
        assert "<urlset" in r.text or "<sitemapindex" in r.text

    def test_api_sitemap(self):
        r = requests.get(f"{API}/sitemap.xml", timeout=30)
        assert r.status_code == 200
        assert "<urlset" in r.text or "<sitemapindex" in r.text

    def test_llms_txt(self):
        r = requests.get(f"{BASE_URL}/llms.txt", timeout=30)
        assert r.status_code == 200
        assert len(r.text) > 50

    def test_llms_full(self):
        r = requests.get(f"{API}/llms-full.txt", timeout=30)
        assert r.status_code == 200
        assert len(r.text) > 50

    def test_projects_list(self):
        r = requests.get(f"{API}/projects", timeout=30)
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_blog_list(self):
        r = requests.get(f"{API}/blog", timeout=30)
        assert r.status_code == 200
        assert isinstance(r.json(), list)
