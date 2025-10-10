from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import EmailStr
from backend.app.repository import get_user_by_username, get_user_by_email, create_user
from backend.app.services.password import PasswordService
from backend.app.services.token import create_token_for_user

class AuthService:
    @staticmethod
    async def authenticate_user(session: AsyncSession, username: str, password: str):
        user = await get_user_by_username(session, username)
        if not user or not PasswordService.verify(password, user.hashed_password):
            return None
        return create_token_for_user(user)

    @staticmethod
    async def register_user(session: AsyncSession, username: str, email: EmailStr, password: str):
        if await get_user_by_username(session, username):
            return None, "Username already registered"
        if await get_user_by_email(session, email):
            return None, "Email already registered"
        hashed_password = PasswordService.hash(password)
        new_user = await create_user(session, username, email, hashed_password)
        token = create_token_for_user(new_user)
        return token, None
