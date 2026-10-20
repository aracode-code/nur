from dataclasses import dataclass
from typing import Callable

from fastapi import Depends, Header

from app.core.config import get_settings
from app.core.errors import AppError

ALL_PERMISSIONS = frozenset(
    {
        "catalog:read",
        "engagement:write",
        "report:create",
        "creator:video:read",
        "creator:video:write",
        "creator:submit",
        "creator:analytics:read",
        "creator:manage",
        "review:read",
        "review:decide",
        "publish:execute",
        "moderation:read",
        "moderation:decide",
        "moderation:restrict",
        "appeal:decide",
        "correction:write",
        "user:read",
        "role:manage",
        "audit:read",
        "analytics:read",
    }
)

ROLE_PERMISSIONS: dict[str, frozenset[str]] = {
    "user": frozenset({"catalog:read", "engagement:write", "report:create"}),
    "creator": frozenset(
        {
            "catalog:read",
            "engagement:write",
            "report:create",
            "creator:video:read",
            "creator:video:write",
            "creator:submit",
            "creator:analytics:read",
        }
    ),
    "reviewer": frozenset(
        {"catalog:read", "review:read", "review:decide", "publish:execute"}
    ),
    "moderator": frozenset(
        {
            "catalog:read",
            "moderation:read",
            "moderation:decide",
            "moderation:restrict",
            "correction:write",
        }
    ),
    "admin": ALL_PERMISSIONS,
    "analyst": frozenset({"catalog:read", "analytics:read", "creator:analytics:read"}),
    "scholar_advisor": frozenset({"catalog:read", "review:read"}),
}


@dataclass(frozen=True)
class Principal:
    user_id: str
    display_name: str
    roles: frozenset[str]
    permissions: frozenset[str]


def _principal(user_id: str, display_name: str, roles: tuple[str, ...]) -> Principal:
    permissions: set[str] = set()
    for role in roles:
        permissions.update(ROLE_PERMISSIONS.get(role, frozenset()))
    return Principal(
        user_id=user_id,
        display_name=display_name,
        roles=frozenset(roles),
        permissions=frozenset(permissions),
    )


# Token dev-only untuk auth_mode=mock. Bukan secret dan tidak boleh dipakai di production.
MOCK_USERS: dict[str, Principal] = {
    "dev-user": _principal("usr_demo_user", "Pengguna Demo", ("user",)),
    "dev-creator": _principal("usr_demo_creator", "Kreator Demo", ("user", "creator")),
    "dev-reviewer": _principal("usr_demo_reviewer", "Reviewer Demo", ("user", "reviewer")),
    "dev-moderator": _principal(
        "usr_demo_moderator", "Moderator Demo", ("user", "moderator")
    ),
    "dev-admin": _principal("usr_demo_admin", "Admin Demo", ("user", "admin")),
    "dev-analyst": _principal("usr_demo_analyst", "Analis Demo", ("analyst",)),
    "dev-scholar": _principal(
        "usr_demo_scholar", "Penasihat Demo", ("user", "scholar_advisor")
    ),
}


def get_current_principal(
    authorization: str | None = Header(default=None),
) -> Principal:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise AppError(
            "UNAUTHORIZED",
            "Token akses diperlukan.",
            status_code=401,
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = authorization.split(" ", 1)[1].strip()
    settings = get_settings()

    if settings.auth_mode != "mock":
        raise AppError(
            "AUTH_NOT_CONFIGURED",
            "Provider autentikasi belum dikonfigurasi.",
            status_code=503,
        )

    principal = MOCK_USERS.get(token)
    if principal is None:
        raise AppError(
            "INVALID_TOKEN",
            "Token tidak valid.",
            status_code=401,
            headers={"WWW-Authenticate": "Bearer"},
        )

    return principal


def require_permission(permission: str) -> Callable[..., Principal]:
    def dependency(principal: Principal = Depends(get_current_principal)) -> Principal:
        if permission not in principal.permissions:
            raise AppError(
                "FORBIDDEN",
                "Anda tidak memiliki izin untuk aksi ini.",
                status_code=403,
            )
        return principal

    return dependency
