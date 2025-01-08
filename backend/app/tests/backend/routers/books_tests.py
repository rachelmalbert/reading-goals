from fastapi.testclient import TestClient

from app.main import app

def test_checkout_book():
    client = TestClient(app)
    response = client.post("/books/checkout", content="0")
    assert response.status_code == 200
    



