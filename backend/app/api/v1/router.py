from fastapi import APIRouter

from app.api.v1 import me

router = APIRouter()
router.include_router(me.router)
