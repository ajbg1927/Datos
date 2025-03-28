import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
import psycopg2

load_dotenv()  

DATABASE_URL = os.getenv("RAILWAY_DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("Falta la variable de entorno RAILWAY_DATABASE_URL")


DATABASE_URL = f"{DATABASE_URL}?sslmode=require"

try:
    engine = create_engine(DATABASE_URL)
    with engine.connect() as connection:
        print("Conexión exitosa a PostgreSQL en Railway")
except Exception as e:
    print(f"Error al conectar con la base de datos: {e}")
