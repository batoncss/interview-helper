import configparser
from pathlib import Path

config_path = Path(__file__).resolve().parent.parent.parent / "conf.ini"

config = configparser.ConfigParser()
config.read(config_path)


SECRET_KEY = config["KEYS"]["SECRET_KEY"]
API_KEY_YANDEX = config["KEYS"]["API_KEY_YANDEX"]
API_KEY_OPENAI = config["KEYS"]["API_KEY_OPENAI"]
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
DATABASE_URL = config["DB"]["URL"]

SAMPLE_RATE = 16000
