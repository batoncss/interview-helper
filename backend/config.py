import configparser
from pathlib import Path

config_path = Path(__file__).resolve().parent.parent / "conf.ini"

config = configparser.ConfigParser()
config.read(config_path)


SECRET_KEY = config["KEYS"]["SECRET_KEY"]
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
