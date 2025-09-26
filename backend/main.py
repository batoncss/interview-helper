from fastapi import FastAPI
from contextlib import asynccontextmanager

from backend.auth.routers import router as auth_router
from backend.users.routers import router as users_router
from backend.common.db.connection import engine, Base


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    await engine.dispose()


app = FastAPI(lifespan=lifespan)

app.include_router(auth_router, prefix="/api")
app.include_router(users_router, prefix="/api")
