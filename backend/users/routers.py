from fastapi import APIRouter, Depends
from .models import UserDB
from ..auth import schemas
from typing import Annotated
from ..auth.service import get_current_active_user

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me", response_model=schemas.User)
async def read_users_me(
    current_user: Annotated[UserDB, Depends(get_current_active_user)]
):
    return current_user
