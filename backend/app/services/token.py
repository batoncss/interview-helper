from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.dependencies.auth_exceptions import AuthError
from backend.app.models.user import UserDB
from backend.app.schemas import Token
from backend.app.core.config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
from backend.app.repository import get_user_by_username


async def get_current_user(token: str, session: AsyncSession) -> UserDB:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise AuthError()
    except JWTError:
        raise AuthError()

    user = await get_user_by_username(session, username)
    if not user:
        raise AuthError()
    return user


def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire.timestamp()})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def create_token_for_user(user: UserDB) -> Token:
    expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_access_token(
        data={"username": user.username, "email": user.email},
        expires_delta=expires,
    )
    return Token(access_token=token, token_type="bearer")
