from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from sqlalchemy.ext.asyncio import AsyncSession

from backend import users
from backend import auth
from ..common.db import get_db
from ..config import ACCESS_TOKEN_EXPIRE_MINUTES

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=auth.Token)
async def register(
    user: auth.schemas.UserRegister,
    session: AsyncSession = Depends(get_db),
):
    # проверка, что юзернейм и email уникальны
    if await users.get_user_by_username(session, user.username):
        raise HTTPException(status_code=409, detail="Username already registered")
    if await users.get_user_by_email(session, str(user.email)):
        raise HTTPException(status_code=409, detail="Email already registered")

    # хэшируем пароль argon2
    hashed_password = auth.get_password_hash(user.password)

    new_user = users.UserDB(
        username=user.username,
        email=str(user.email),
        hashed_password=hashed_password,
        disabled=False,
    )
    session.add(new_user)
    await session.commit()
    await session.refresh(new_user)

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": new_user.username, "email": new_user.email},
        expires_delta=access_token_expires,
    )
    return auth.schemas.Token(access_token=access_token, token_type="bearer")


@router.post("/token", response_model=auth.schemas.Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: AsyncSession = Depends(get_db),
):
    user = await auth.authenticate_user(session, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.username, "email": user.email},
        expires_delta=access_token_expires,
    )
    return auth.schemas.Token(access_token=access_token, token_type="bearer")
