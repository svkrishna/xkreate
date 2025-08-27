import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database.base import get_db
from app.models.user import User
from app.core.security import get_password_hash

client = TestClient(app)


@pytest.fixture
def test_db():
    # This would be a test database in a real setup
    pass


def test_register_user():
    """Test user registration."""
    response = client.post(
        "/auth/register",
        json={"email": "test@example.com", "password": "testpassword123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@example.com"
    assert "id" in data


def test_login_user():
    """Test user login."""
    # First register a user
    client.post(
        "/auth/register",
        json={"email": "login@example.com", "password": "testpassword123"}
    )
    
    # Then try to login
    response = client.post(
        "/auth/login",
        json={"email": "login@example.com", "password": "testpassword123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data


def test_get_presets():
    """Test presets endpoint."""
    response = client.get("/presets")
    assert response.status_code == 200
    data = response.json()
    assert "groups" in data
    assert len(data["groups"]) > 0


def test_health_check():
    """Test health check endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["engine"] == "fastapi"


