import configparser
from pathlib import Path

from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.orm import declarative_base

config_path = Path(__file__).resolve().parent.parent.parent.parent / "conf.ini"
config = configparser.ConfigParser()
config.read(config_path)
DATABASE_URL = config["DB"]["URL"]


Base = declarative_base()
engine = create_async_engine(DATABASE_URL, echo=True)
async_session_maker = async_sessionmaker(engine, expire_on_commit=False)

async def get_db():
    async with async_session_maker() as session:
        yield session
