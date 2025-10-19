from fastapi import FastAPI
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware

from backend.app.db import engine
from backend.app.models.base import Base
from backend.app.routers.auth import router as auth_router
from backend.app.routers.users import router as users_router
from backend.app.routers.questions import router as questions_router
from backend.app.routers.speech import router as ws_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    await engine.dispose()

app = FastAPI(lifespan=lifespan)

app.include_router(auth_router, prefix="/api")
app.include_router(users_router, prefix="/api")
app.include_router(questions_router, prefix="/api")
app.include_router(ws_router)
