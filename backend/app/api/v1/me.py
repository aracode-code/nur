from fastapi import APIRouter, Depends

from app.core.security import Principal, get_current_principal

router = APIRouter(tags=["identity"])


@router.get("/me")
def read_me(principal: Principal = Depends(get_current_principal)) -> dict[str, object]:
    return {
        "id": principal.user_id,
        "display_name": principal.display_name,
        "roles": sorted(principal.roles),
        "permissions": sorted(principal.permissions),
    }
