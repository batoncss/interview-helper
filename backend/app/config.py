import os
from pathlib import Path
from dotenv import load_dotenv

# Подгружаем .env
env_path = Path(__file__).resolve().parent.parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

DEV_MODE = os.getenv("DEV_MODE", "1")  # 1 - prod, 2 - dev

if DEV_MODE == "2":
    DATABASE_URL = os.getenv("DATABASE_URL_DEV")
else:
    DATABASE_URL = os.getenv("DATABASE_URL_PROD")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL не задана в окружении")

POSTGRES_USER = os.getenv("POSTGRES_USER")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD")
POSTGRES_DB = os.getenv("POSTGRES_DB")
SECRET_KEY = os.getenv("SECRET_KEY")
API_KEY_OPENAI = os.getenv("API_KEY_OPENAI")
