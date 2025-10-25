import sys
import socket
from contextlib import asynccontextmanager

from fastapi import FastAPI
from sqlalchemy.ext.asyncio import create_async_engine

from backend.app.config import DATABASE_URL
from backend.app.models.base import Base
from backend.app.routers.auth import router as auth_router
from backend.app.routers.users import router as users_router
from backend.app.routers.questions import router as questions_router
from backend.app.routers.speech import router as ws_router

engine = create_async_engine(DATABASE_URL, echo=False)

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
    except (OSError, socket.gaierror):
        sys.exit(
            "Не удалось подключиться к БД. "
            "Вероятно, выбран неправильный mode в .env"
        )
    yield
    await engine.dispose()

app = FastAPI(lifespan=lifespan)

app.include_router(auth_router, prefix="/api")
app.include_router(users_router, prefix="/api")
app.include_router(questions_router, prefix="/api")
app.include_router(ws_router)