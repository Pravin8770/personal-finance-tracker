"""
Test module for health API
"""
from fastapi.testclient import TestClient

from main import app

client = TestClient(app)

def test_read_health():
    """
    Test health endpoint returns OK
    """
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
