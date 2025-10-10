from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.dependencies.auth import get_current_active_user
from backend.app.dependencies.db import get_session
from backend.app.models.user import UserDB
from backend.app.schemas import User, Token, UserRegister
from backend.app.services.auth import AuthService

router = APIRouter()


@router.get("/users/me", response_model=User)
async def read_users_me(current_user: UserDB = Depends(get_current_active_user)):
    return current_user


@router.post("/app/register", response_model=Token)
async def register(user: UserRegister, session: AsyncSession = Depends(get_session)):
    token, error = await AuthService.register_user(session, user.username, user.email, user.password)
    if error:
        raise HTTPException(status_code=409, detail=error)
    return token
