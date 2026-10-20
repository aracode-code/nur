from fastapi.testclient import TestClient


def test_health_returns_ok(client: TestClient) -> None:
    response = client.get("/health")

    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "ok"
    assert body["service"] == "NUR API"
    assert body["environment"] == "local"


def test_ready_reports_unconfigured_dependencies(client: TestClient) -> None:
    response = client.get("/ready")

    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "degraded"
    assert body["checks"] == {
        "database": "not_configured",
        "video_provider": "not_configured",
        "auth": "mock",
    }
