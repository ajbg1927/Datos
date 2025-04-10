from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from backend.database.base import Base  

class Archivo(Base):
    __tablename__ = 'archivos'
    id = Column(Integer, primary_key=True)
    nombre = Column(String)
    hojas = relationship("Hoja", back_populates="archivo")

class Hoja(Base):
    __tablename__ = 'hojas'
    id = Column(Integer, primary_key=True)
    nombre = Column(String)
    archivo_id = Column(Integer, ForeignKey('archivos.id'))
    archivo = relationship("Archivo", back_populates="hojas")
    datos = relationship("Datos", back_populates="hoja")

class Datos(Base):
    __tablename__ = 'datos'
    id = Column(Integer, primary_key=True)
    hoja_id = Column(Integer, ForeignKey('hojas.id'))
    hoja = relationship("Hoja", back_populates="datos")
    columna = Column(String)
    valor = Column(String) 

class DatosExcel(Base):
    __tablename__ = 'datos_excel'
    id = Column(Integer, primary_key=True)
    nombre_archivo = Column(String)
    nombre_hoja = Column(String)
    columna = Column(String)
    valor = Column(String)
