from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status

from backend.app.dependencies.auth_exceptions import AuthError
from backend.app.dependencies.db import get_session
from backend.app.models.user import UserDB
from backend.app.services.token import get_current_user

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/app/token")

async def get_current_active_user(
    token: str = Depends(oauth2_scheme),
    session: AsyncSession = Depends(get_session),
) -> UserDB:
    try:
        user = await get_current_user(token, session)
    except AuthError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Не удалось проверить учетные данные",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if user.disabled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Пользователь неактивен"
        )

    return user
