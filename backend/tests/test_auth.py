from fastapi import Depends
from fastapi.testclient import TestClient

from app.core.security import Principal, require_permission
from app.main import create_app


def _auth(token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {token}"}


def _permission_app(permission: str):
    app = create_app()

    @app.get("/_test/secure")
    def secure(principal: Principal = Depends(require_permission(permission))) -> dict[str, str]:
        return {"user_id": principal.user_id}

    return app


def test_me_requires_token(client: TestClient) -> None:
    response = client.get("/api/v1/me")

    assert response.status_code == 401
    assert response.json()["error"]["code"] == "UNAUTHORIZED"
    assert response.headers["WWW-Authenticate"] == "Bearer"


def test_invalid_token_is_rejected(client: TestClient) -> None:
    response = client.get("/api/v1/me", headers=_auth("not-a-real-token"))

    assert response.status_code == 401
    assert response.json()["error"]["code"] == "INVALID_TOKEN"


def test_user_principal_roles_and_permissions(client: TestClient) -> None:
    response = client.get("/api/v1/me", headers=_auth("dev-user"))

    assert response.status_code == 200
    body = response.json()
    assert body["roles"] == ["user"]
    assert "catalog:read" in body["permissions"]
    assert "engagement:write" in body["permissions"]
    assert "review:read" not in body["permissions"]


def test_creator_cannot_read_audit_logs() -> None:
    app = _permission_app("audit:read")

    with TestClient(app) as client:
        response = client.get("/_test/secure", headers=_auth("dev-creator"))

    assert response.status_code == 403
    assert response.json()["error"]["code"] == "FORBIDDEN"


def test_reviewer_can_read_review_queue() -> None:
    app = _permission_app("review:read")

    with TestClient(app) as client:
        response = client.get("/_test/secure", headers=_auth("dev-reviewer"))

    assert response.status_code == 200
    assert response.json()["user_id"] == "usr_demo_reviewer"


def test_moderator_cannot_publish() -> None:
    app = _permission_app("publish:execute")

    with TestClient(app) as client:
        response = client.get("/_test/secure", headers=_auth("dev-moderator"))

    assert response.status_code == 403


def test_admin_unknown_permission_is_denied() -> None:
    app = _permission_app("tidak:ada")

    with TestClient(app) as client:
        response = client.get("/_test/secure", headers=_auth("dev-admin"))

    assert response.status_code == 403
