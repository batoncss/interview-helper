from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from sqlalchemy.ext.asyncio import AsyncSession

from backend.auth.service import get_password_hash, authenticate_user
from backend.users.repository import get_user_by_username, get_user_by_email
from backend.auth import schemas
from backend.common.db.connection import get_db
from backend.config import ACCESS_TOKEN_EXPIRE_MINUTES
from backend.users.models import UserDB
from backend.auth.service import create_access_token

router = APIRouter(prefix="/api", tags=["auth"])

@router.post("/register", response_model=schemas.Token)
async def register(user: schemas.UserRegister, session: AsyncSession = Depends(get_db)):
    if await get_user_by_username(session, user.username):
        raise HTTPException(status_code=409, detail="Username already registered")
    if await get_user_by_email(session, str(user.email)):
        raise HTTPException(status_code=409, detail="Email already registered")

    hashed_password = get_password_hash(user.password)
    new_user = UserDB(
        username=user.username,
        email=str(user.email),
        hashed_password=hashed_password,
        disabled=False,
    )
    session.add(new_user)
    await session.commit()
    await session.refresh(new_user)

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": new_user.username}, expires_delta=access_token_expires
    )
    return schemas.Token(access_token=access_token, token_type="bearer")

@router.post("/token", response_model=schemas.Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: AsyncSession = Depends(get_db),
):
    user = await authenticate_user(session, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return schemas.Token(access_token=access_token, token_type="bearer")
