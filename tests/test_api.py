from fastapi.testclient import TestClient

from backend.app.main import app

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_model_health_endpoint():
    response = client.get("/api/v1/health/models")
    assert response.status_code == 200
    assert all(response.json().values())


def test_segments_endpoint_returns_customer_segments():
    response = client.get("/api/v1/segments")
    assert response.status_code == 200
    data = response.json()
    assert data["total_customers"] > 0
    assert data["number_of_segments"] > 0
    assert len(data["segments"]) == data["number_of_segments"]


def test_inactivity_model_metadata_endpoint():
    response = client.get("/api/v1/models/inactivity")
    assert response.status_code == 200
    data = response.json()
    assert data["prediction_window_days"] > 0
    assert 0 <= data["decision_threshold"] <= 1
    assert "roc_auc" in data["test_metrics"]


def test_prediction_endpoint_returns_probability_and_horizon():
    payload = {
        "frequency": 2,
        "purchase_lines": 10,
        "monetary": 500,
        "average_line_value": 50,
        "unique_products": 8,
        "average_quantity": 2,
        "recency_days": 45,
        "average_order_value": 250,
    }
    response = client.post("/api/v1/predict/inactivity", json=payload)
    assert response.status_code == 200
    data = response.json()["prediction"]
    assert 0 <= data["inactivity_probability"] <= 1
    assert 0 <= data["decision_threshold"] <= 1
    assert data["prediction_horizon_days"] > 0


def test_prediction_endpoint_rejects_negative_features():
    payload = {
        "frequency": -1,
        "purchase_lines": 10,
        "monetary": 500,
        "average_line_value": 50,
        "unique_products": 8,
        "average_quantity": 2,
        "recency_days": 45,
        "average_order_value": 250,
    }
    response = client.post("/api/v1/predict/inactivity", json=payload)
    assert response.status_code == 422
