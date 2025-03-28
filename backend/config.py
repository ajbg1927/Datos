from dotenv import load_dotenv
from sqlalchemy import create_engine
import os

load_dotenv()

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False


DATABASE_URL= "postgresql://postgres:DRNngGvVbyBGWDibAMcZvjSdReSQDyTP@shuttle.proxy.rlwy.net:42394/railway"
engine = create_engine(DATABASE_URL)