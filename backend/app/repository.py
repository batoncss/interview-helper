from pydantic import EmailStr
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.models.user import UserDB


async def get_user_by_username(session: AsyncSession, username: str):
    result = await session.execute(select(UserDB).where(UserDB.username == username))
    return result.scalars().first()

async def get_user_by_email(session: AsyncSession, email: EmailStr):
    result = await session.execute(select(UserDB).where(UserDB.email == email))
    return result.scalars().first()

async def create_user(session: AsyncSession, username: str, email: EmailStr, hashed_password: str) -> UserDB:
    user = UserDB(username=username, email=email, hashed_password=hashed_password)
    session.add(user)
    await session.commit()
    await session.refresh(user)
    return user
