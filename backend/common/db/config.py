import configparser
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
config_path = BASE_DIR.parent / "common/conf.ini"

config = configparser.ConfigParser()
config.read(config_path)

DATABASE_URL = config["DB"]["URL"]
