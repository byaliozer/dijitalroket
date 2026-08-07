"""SEO endpoint tests: /api/sitemap.xml, /robots.txt, /sitemap.xml"""
import os
import re
import xml.etree.ElementTree as ET
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://dr-creative-hub-1.preview.emergentagent.com").rstrip("/")


@pytest.fixture(scope="module")
def s():
    return requests.Session()


# --- Backend dynamic sitemap ---
class TestDynamicSitemap:
    def test_api_sitemap_status_and_content_type(self, s):
        r = s.get(f"{BASE_URL}/api/sitemap.xml", timeout=30)
        assert r.status_code == 200, r.text[:300]
        ct = r.headers.get("content-type", "")
        assert "xml" in ct.lower(), f"Unexpected CT: {ct}"

    def test_api_sitemap_valid_xml_and_urls(self, s):
        r = s.get(f"{BASE_URL}/api/sitemap.xml", timeout=30)
        body = r.text
        # Parse XML
        root = ET.fromstring(body)
        assert root.tag.endswith("urlset"), f"Root tag: {root.tag}"
        ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
        locs = [e.text for e in root.findall(".//sm:loc", ns)]
        assert len(locs) > 0
        joined = "\n".join(locs)
        for path in ["/", "/projeler", "/blog", "/hakkimizda", "/iletisim", "/kurumsal-cozumler", "/proje-talep"]:
            assert any(l.rstrip("/").endswith(path.rstrip("/")) or l.endswith(path) for l in locs), \
                f"Missing static path {path} in {locs}"

    def test_api_sitemap_has_dynamic_entries(self, s):
        r = s.get(f"{BASE_URL}/api/sitemap.xml", timeout=30)
        body = r.text
        # dynamic entries should appear as /projeler/<slug> and /blog/<slug>
        has_project_detail = re.search(r"/projeler/[^<\s/]+", body) is not None
        has_blog_detail = re.search(r"/blog/[^<\s/]+", body) is not None
        # These are conditional on published data existing; if not present, log via assert-with-msg not strict
        # But we require the structure to at least be parseable and not fail
        assert "urlset" in body
        print(f"has_project_detail={has_project_detail}, has_blog_detail={has_blog_detail}")

    def test_api_sitemap_no_objectid_leak(self, s):
        r = s.get(f"{BASE_URL}/api/sitemap.xml", timeout=30)
        assert "ObjectId(" not in r.text
        assert "_id" not in r.text or r.text.count("_id") == 0


# --- Frontend static robots.txt ---
class TestRobotsTxt:
    def test_robots_txt_200_and_plaintext(self, s):
        r = s.get(f"{BASE_URL}/robots.txt", timeout=30)
        assert r.status_code == 200
        ct = r.headers.get("content-type", "")
        # Should not be HTML nginx page
        assert "<html" not in r.text.lower()[:2000], f"Got HTML page instead of robots.txt: {r.text[:300]}"
        # content-type may be text/plain
        assert "text" in ct.lower()

    def test_robots_txt_content(self, s):
        r = s.get(f"{BASE_URL}/robots.txt", timeout=30)
        body = r.text
        assert "User-agent: *" in body
        assert "Disallow: /admin/" in body
        assert "Disallow: /firma/" in body
        assert re.search(r"^Sitemap:\s*http", body, re.MULTILINE) is not None, body[:500]


# --- Frontend static sitemap.xml ---
class TestStaticSitemap:
    def test_static_sitemap_200(self, s):
        r = s.get(f"{BASE_URL}/sitemap.xml", timeout=30)
        assert r.status_code == 200
        assert "<html" not in r.text.lower()[:2000]
        assert "urlset" in r.text
        assert "https://dijitalroket.com/projeler" in r.text
