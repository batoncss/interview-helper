from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from .models import UserDB

async def get_user_by_username(session: AsyncSession, username: str):
    result = await session.execute(select(UserDB).where(UserDB.username == username))
    return result.scalars().first()

async def get_user_by_email(session: AsyncSession, email: str):
    result = await session.execute(select(UserDB).where(UserDB.email == email))
    return result.scalars().first()
