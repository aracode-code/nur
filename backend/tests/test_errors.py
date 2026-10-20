from fastapi.testclient import TestClient

from app.main import create_app


def test_not_found_uses_error_envelope(client: TestClient) -> None:
    response = client.get("/tidak-ada")

    assert response.status_code == 404
    assert response.headers["X-Request-ID"]
    body = response.json()
    assert body["error"]["code"] == "NOT_FOUND"
    assert body["error"]["request_id"] == response.headers["X-Request-ID"]
    assert body["error"]["details"] == []


def test_request_id_is_echoed_when_valid(client: TestClient) -> None:
    response = client.get("/health", headers={"X-Request-ID": "req-test-123"})

    assert response.headers["X-Request-ID"] == "req-test-123"


def test_invalid_request_id_is_replaced(client: TestClient) -> None:
    response = client.get("/health", headers={"X-Request-ID": "bad id!"})

    request_id = response.headers["X-Request-ID"]
    assert request_id != "bad id!"
    assert len(request_id) == 32


def test_validation_error_envelope() -> None:
    app = create_app()

    @app.get("/_test/echo")
    def echo(limit: int) -> dict[str, int]:
        return {"limit": limit}

    with TestClient(app) as client:
        response = client.get("/_test/echo?limit=nope")

    assert response.status_code == 422
    body = response.json()
    assert body["error"]["code"] == "VALIDATION_ERROR"
    assert body["error"]["details"][0]["field"] == "query.limit"


def test_unexpected_error_does_not_leak_internals() -> None:
    app = create_app()

    @app.get("/_test/boom")
    def boom() -> None:
        raise RuntimeError("secret internal detail")

    with TestClient(app, raise_server_exceptions=False) as client:
        response = client.get("/_test/boom")

    assert response.status_code == 500
    assert "secret internal detail" not in response.text
    assert response.json()["error"]["code"] == "INTERNAL_ERROR"
