from dotenv import load_dotenv
import os
from sqlalchemy import create_engine

load_dotenv()

db_url = os.getenv("DATABASE_URL")

if db_url and "sslmode" not in db_url:
    if "?" in db_url:
        db_url += "&sslmode=require"
    else:
        db_url += "?sslmode=require"

SQLALCHEMY_DATABASE_URI = db_url

class Config:
    SQLALCHEMY_DATABASE_URI = SQLALCHEMY_DATABASE_URI
    SQLALCHEMY_TRACK_MODIFICATIONS = False

engine = create_engine(SQLALCHEMY_DATABASE_URI)
