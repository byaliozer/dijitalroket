"""
Backend API tests for Dijital Roket.
Covers: auth, contact, project-request, blog, projects, admin endpoints.
"""
import os
import time
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
if not BASE_URL:
    # Try frontend .env file
    fenv = "/app/frontend/.env"
    if os.path.exists(fenv):
        for line in open(fenv):
            if line.startswith("REACT_APP_BACKEND_URL="):
                BASE_URL = line.split("=", 1)[1].strip().rstrip("/")

API = f"{BASE_URL}/api"

ADMIN_EMAIL = "admin@dijitalroket.com"
ADMIN_PASSWORD = "Roket2026!"


@pytest.fixture(scope="session")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def token(session):
    r = session.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, f"Login failed: {r.status_code} {r.text}"
    return r.json()["token"]


@pytest.fixture(scope="session")
def auth_headers(token):
    return {"Authorization": f"Bearer {token}"}


# ----- Auth -----
class TestAuth:
    def test_login_success(self, session):
        r = session.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        assert r.status_code == 200
        data = r.json()
        assert "token" in data and isinstance(data["token"], str) and len(data["token"]) > 10
        assert "user" in data
        assert data["user"]["email"] == ADMIN_EMAIL
        assert data["user"]["role"] == "admin"
        assert "_id" not in data["user"]
        assert "password_hash" not in data["user"]

    def test_login_wrong_password(self, session):
        r = session.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": "WrongPass!"})
        assert r.status_code == 401

    def test_auth_me(self, session, auth_headers):
        r = session.get(f"{API}/auth/me", headers=auth_headers)
        assert r.status_code == 200
        data = r.json()
        assert data["email"] == ADMIN_EMAIL
        assert data["role"] == "admin"
        assert "_id" not in data
        assert "password_hash" not in data

    def test_auth_me_no_token(self, session):
        r = session.get(f"{API}/auth/me")
        assert r.status_code == 401


# ----- Contact -----
class TestContact:
    def test_contact_success(self, session):
        payload = {
            "name": "TEST User",
            "email": "test_contact@example.com",
            "message": "This is a test contact message to verify creation."
        }
        r = session.post(f"{API}/contact", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["name"] == payload["name"]
        assert data["email"] == payload["email"]
        assert data["message"] == payload["message"]
        assert "id" in data
        assert "_id" not in data
        assert data["status"] == "new"

    def test_contact_short_message(self, session):
        r = session.post(f"{API}/contact", json={
            "name": "TEST",
            "email": "t@e.com",
            "message": "short"
        })
        assert r.status_code == 422


# ----- Project request -----
class TestProjectRequest:
    def test_project_request_success(self, session):
        payload = {
            "company_name": "TEST Company",
            "contact_name": "TEST Contact",
            "email": "test_pr@example.com",
            "project_type": "Kurumsal Web"
        }
        r = session.post(f"{API}/project-request", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["company_name"] == payload["company_name"]
        assert data["email"] == payload["email"]
        assert "id" in data
        assert "_id" not in data


# ----- Blog -----
class TestBlog:
    def test_list_blog(self, session):
        r = session.get(f"{API}/blog")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) >= 5
        for p in data:
            assert "_id" not in p
            assert "slug" in p and "title" in p

    def test_get_blog_by_slug(self, session):
        r = session.get(f"{API}/blog/sirketinizde-hangi-surecler-dijitallestirilmeli")
        assert r.status_code == 200
        data = r.json()
        assert data["slug"] == "sirketinizde-hangi-surecler-dijitallestirilmeli"
        assert "_id" not in data

    def test_get_blog_nonexistent(self, session):
        r = session.get(f"{API}/blog/nonexistent-slug-xyz")
        assert r.status_code == 404


# ----- Projects -----
class TestProjects:
    def test_list_projects(self, session):
        r = session.get(f"{API}/projects")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) >= 4
        for p in data:
            assert "_id" not in p

    def test_get_project_by_slug(self, session):
        r = session.get(f"{API}/projects/livanespor-kurumsal-web-donusumu")
        assert r.status_code == 200
        data = r.json()
        assert data["slug"] == "livanespor-kurumsal-web-donusumu"
        assert "_id" not in data


# ----- Admin -----
class TestAdminEndpoints:
    def test_stats_requires_auth(self, session):
        r = session.get(f"{API}/admin/stats")
        assert r.status_code == 401

    def test_stats_with_auth(self, session, auth_headers):
        r = session.get(f"{API}/admin/stats", headers=auth_headers)
        assert r.status_code == 200
        data = r.json()
        for key in ["contacts_total", "contacts_new", "project_requests_total",
                    "project_requests_new", "blog_posts", "case_studies"]:
            assert key in data
            assert isinstance(data[key], int)
        assert data["blog_posts"] >= 5
        assert data["case_studies"] >= 4

    def test_admin_contacts_requires_auth(self, session):
        r = session.get(f"{API}/admin/contacts")
        assert r.status_code == 401

    def test_admin_contacts_with_auth(self, session, auth_headers):
        r = session.get(f"{API}/admin/contacts", headers=auth_headers)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        for c in data:
            assert "_id" not in c


# ----- Admin blog CRUD -----
class TestAdminBlogCRUD:
    def test_blog_create_update_delete(self, session, auth_headers):
        slug = f"test-blog-{int(time.time())}"
        payload = {
            "slug": slug,
            "title": "TEST Blog Post",
            "excerpt": "TEST excerpt",
            "content": "TEST blog post content for automated tests.",
            "category": "TEST",
            "cover_image": "https://example.com/img.jpg",
            "read_time": 3
        }
        # Create
        r = session.post(f"{API}/admin/blog", json=payload, headers=auth_headers)
        assert r.status_code == 200, r.text
        post = r.json()
        assert post["slug"] == slug
        assert post["title"] == "TEST Blog Post"
        assert "id" in post and "_id" not in post
        post_id = post["id"]

        # Verify via GET
        rg = session.get(f"{API}/blog/{slug}")
        assert rg.status_code == 200
        assert rg.json()["title"] == "TEST Blog Post"

        # Update
        upd = {**payload, "title": "TEST Updated Title"}
        ru = session.put(f"{API}/admin/blog/{post_id}", json=upd, headers=auth_headers)
        assert ru.status_code == 200
        assert ru.json()["title"] == "TEST Updated Title"

        # Verify update persisted
        rg2 = session.get(f"{API}/blog/{slug}")
        assert rg2.json()["title"] == "TEST Updated Title"

        # Delete
        rd = session.delete(f"{API}/admin/blog/{post_id}", headers=auth_headers)
        assert rd.status_code == 200

        # Verify deletion
        rg3 = session.get(f"{API}/blog/{slug}")
        assert rg3.status_code == 404


# ----- Admin project CRUD -----
class TestAdminProjectCRUD:
    def test_project_create_delete(self, session, auth_headers):
        slug = f"test-project-{int(time.time())}"
        payload = {
            "slug": slug,
            "title": "TEST Case Study",
            "client": "TEST Client",
            "sector": "TEST Sector",
            "tags": ["TEST"],
            "need": "TEST need",
            "solution": "TEST solution",
            "result": "TEST result"
        }
        r = session.post(f"{API}/admin/projects", json=payload, headers=auth_headers)
        assert r.status_code == 200, r.text
        proj = r.json()
        assert proj["slug"] == slug
        assert "_id" not in proj
        proj_id = proj["id"]

        # Verify
        rg = session.get(f"{API}/projects/{slug}")
        assert rg.status_code == 200

        # Delete
        rd = session.delete(f"{API}/admin/projects/{proj_id}", headers=auth_headers)
        assert rd.status_code == 200

        rg2 = session.get(f"{API}/projects/{slug}")
        assert rg2.status_code == 404
