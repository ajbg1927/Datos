import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
import psycopg2
from urllib.parse import urlparse

load_dotenv()  

DATABASE_URL = os.getenv("NEON_DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("Falta la variable de entorno NEON_DATABASE_URL")


DATABASE_URL = f"{DATABASE_URL}?sslmode=require"

try:
    engine = create_engine(DATABASE_URL)
    with engine.connect() as connection:
        print("Conexión exitosa a PostgreSQL con SQLAlchemy")
except Exception as e:
    print(f"Error al conectar con la base de datos: {e}")


try:
    result = urlparse(DATABASE_URL)
    
    connection = psycopg2.connect(
        dbname=result.path[1:],  
        user=result.username,
        password=result.password,
        host=result.hostname,
        port=result.port
    )
    print("Conexión exitosa a PostgreSQL con psycopg2")
    connection.close()
except Exception as e:
    print(f"Error al conectar con psycopg2: {e}")
