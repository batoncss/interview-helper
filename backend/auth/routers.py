from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from sqlalchemy.ext.asyncio import AsyncSession

from backend import users
from backend.auth import service as auth_service, schemas
from ..common.db import get_db
from ..config import ACCESS_TOKEN_EXPIRE_MINUTES

router = APIRouter(prefix="/auth", tags=["auth"])

def _create_token_for_user(user: users.UserDB) -> schemas.Token:
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth_service.create_access_token(
        data={"sub": user.username, "email": user.email},
        expires_delta=access_token_expires,
    )
    return schemas.Token(access_token=access_token, token_type="bearer")


@router.post("/register", response_model=schemas.Token)
async def register(
    user: schemas.UserRegister,
    session: AsyncSession = Depends(get_db),
):
    if await users.get_user_by_username(session, user.username):
        raise HTTPException(status_code=409, detail="Username already registered")
    if await users.get_user_by_email(session, user.email):
        raise HTTPException(status_code=409, detail="Email already registered")

    hashed_password = auth_service.PasswordService.hash(user.password)

    new_user = users.UserDB(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        disabled=False,
    )
    session.add(new_user)
    await session.commit()
    await session.refresh(new_user)

    return _create_token_for_user(new_user)


@router.post("/token", response_model=schemas.Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: AsyncSession = Depends(get_db),
):
    user = await users.get_user_by_username(session, form_data.username)
    if not user or not auth_service.PasswordService.verify(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth_service.create_access_token(
        data={"sub": user.username, "email": user.email},
        expires_delta=access_token_expires,
    )
    return schemas.Token(access_token=access_token, token_type="bearer")

