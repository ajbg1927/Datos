from database.base import Base
from sqlalchemy import Column, Integer, String, Date, Float, ForeignKey
from sqlalchemy.orm import relationship


class Archivo(Base):
    __tablename__ = 'archivos'

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String)
    tipo = Column(String)
    hojas = relationship("Hoja", back_populates="archivo")


class Hoja(Base):
    __tablename__ = 'hojas'

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String)
    archivo_id = Column(Integer, ForeignKey("archivos.id"))
    archivo = relationship("Archivo", back_populates="hojas")
    datos = relationship("Datos", back_populates="hoja")


class Datos(Base):
    __tablename__ = 'datos'

    id = Column(Integer, primary_key=True, index=True)
    hoja_id = Column(Integer, ForeignKey("hojas.id"))
    rubro = Column(String, nullable=True)
    valor = Column(Float, nullable=True)
    descripcion = Column(String, nullable=True)
    fecha = Column(Date, nullable=True)

    hoja = relationship("Hoja", back_populates="datos")


class DatosExcel(Base):
    __tablename__ = 'datos_excel'

    id = Column(Integer, primary_key=True, index=True)
    nombre_archivo = Column(String)
    nombre_hoja = Column(String)
    rubro = Column(String)
    valor = Column(Float)
    descripcion = Column(String)
    fecha = Column(Date)
