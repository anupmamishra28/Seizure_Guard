from fastapi.testclient import TestClient

from main import app


client = TestClient(app)


def test_home_page():
    response = client.get("/")

    assert response.status_code == 200
    assert response.json()["message"] == "SeizureGuard Backend is Running!"


def test_invalid_file_type():
    response = client.post(
        "/predict",
        files={
            "file": (
                "test.txt",
                b"this is not an EDF file",
                "text/plain"
            )
        },
        data={
            "patient_id": "TEST001",
            "name": "Test User",
            "age": 20,
            "gender": "Test"
        }
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "Please upload an EDF file."


def test_history_endpoint():
    response = client.get("/history")

    assert response.status_code == 200
    assert "history" in response.json()