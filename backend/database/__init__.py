from flask_sqlalchemy import SQLAlchemy
from .base import Base
from .models import Archivo, Hoja, Datos, DatosExcel

db = SQLAlchemy()