from dotenv import load_dotenv
import os
from sqlalchemy import create_engine

load_dotenv()

db_url = os.getenv("DB_CONNECTION_STRING")


if db_url:
    if not db_url.startswith("postgresql+psycopg2://"):
        db_url = db_url.replace("postgresql://", "postgresql+psycopg2://", 1)

    if "sslmode" not in db_url:
        if "?" in db_url:
            db_url += "&sslmode=require"
        else:
            db_url += "?sslmode=require"


SQLALCHEMY_DATABASE_URI = db_url

class Config:
    SQLALCHEMY_DATABASE_URI = SQLALCHEMY_DATABASE_URI
    SQLALCHEMY_TRACK_MODIFICATIONS = False

engine = create_engine(SQLALCHEMY_DATABASE_URI)


