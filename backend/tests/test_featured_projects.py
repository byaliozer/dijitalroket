"""Tests for featured project functionality (iteration 9)."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://dijital-roket-deploy.preview.emergentagent.com").rstrip("/")
ADMIN_EMAIL = "admin@dijitalroket.com"
ADMIN_PASSWORD = "Roket2026!"


@pytest.fixture(scope="module")
def token():
    r = requests.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, r.text
    return r.json()["token"]


@pytest.fixture(scope="module")
def auth(token):
    return {"Authorization": f"Bearer {token}"}


def test_projects_have_featured_field():
    r = requests.get(f"{BASE_URL}/api/projects")
    assert r.status_code == 200
    projects = r.json()
    assert len(projects) >= 6
    for p in projects:
        assert "featured" in p
        assert isinstance(p["featured"], bool)
    featured = [p for p in projects if p["featured"]]
    assert len(featured) == 4
    titles = {p["title"] for p in featured}
    assert any("ARS" in t for t in titles)
    assert any("ABC" in t for t in titles)
    assert any("Metehan" in t for t in titles)
    assert any("NAMTAŞ" in t or "NAMTAS" in t for t in titles)


def test_toggle_featured_persists_and_reverts(auth):
    # Find a non-featured project
    r = requests.get(f"{BASE_URL}/api/projects")
    projects = r.json()
    target = next(p for p in projects if not p["featured"])
    pid = target["id"]

    # Update to featured=true using CaseStudyCreate full object
    payload = {k: target[k] for k in target if k not in ("id", "created_at", "_id")}
    payload["featured"] = True

    r = requests.put(f"{BASE_URL}/api/admin/projects/{pid}", json=payload, headers=auth)
    assert r.status_code == 200, r.text
    assert r.json().get("featured") is True

    # Verify via GET
    r2 = requests.get(f"{BASE_URL}/api/projects")
    updated = next(p for p in r2.json() if p["id"] == pid)
    assert updated["featured"] is True

    # Revert
    payload["featured"] = False
    r3 = requests.put(f"{BASE_URL}/api/admin/projects/{pid}", json=payload, headers=auth)
    assert r3.status_code == 200
    assert r3.json().get("featured") is False

    r4 = requests.get(f"{BASE_URL}/api/projects")
    reverted = next(p for p in r4.json() if p["id"] == pid)
    assert reverted["featured"] is False
    # Also confirm we're back to 4 featured
    assert len([p for p in r4.json() if p["featured"]]) == 4
