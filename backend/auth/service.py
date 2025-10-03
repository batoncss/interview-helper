from datetime import datetime, timedelta, timezone
from typing import Optional

from jwt import encode, decode, ExpiredSignatureError, InvalidTokenError
from sqlalchemy.ext.asyncio import AsyncSession
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

from ..config import SECRET_KEY, ALGORITHM
from ..users import get_user_by_username, UserDB

pwd_hasher = PasswordHasher(time_cost=4, memory_cost=2**16, parallelism=2)

class PasswordService:
    @staticmethod
    def verify(plain_password: str, hashed_password: str) -> bool:
        try:
            return pwd_hasher.verify(hashed_password, plain_password)
        except VerifyMismatchError:
            return False

    @staticmethod
    def hash(password: str) -> str:
        return pwd_hasher.hash(password)

class AuthError(Exception):
    pass

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=15))
    to_encode["exp"] = expire
    return encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(token: str, session: AsyncSession) -> UserDB:
    try:
        payload = decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if not username:
            raise AuthError("Missing username in token")
    except (InvalidTokenError, ExpiredSignatureError):
        raise AuthError("Invalid or expired token")

    user = await get_user_by_username(session, username)
    if not user:
        raise AuthError("User not found")
    return user
