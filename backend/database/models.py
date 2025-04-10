from sqlalchemy import Column, Integer, String, Float, Date
from database import Base

class Compromiso(Base):
    __tablename__ = "compromisos"

    id = Column(Integer, primary_key=True, index=True)
    entidad = Column(String)
    dependencia = Column(String)
    vigencia = Column(String)
    rubro = Column(String)
    nombre_rubro = Column(String)
    valor_comprometido = Column(Float)
    valor_ejecutado = Column(Float)
    porcentaje_ejecucion = Column(Float)

class PlanAccion(Base):
    __tablename__ = "planes_accion"

    id = Column(Integer, primary_key=True, index=True)
    dependencia = Column(String)
    nombre_proyecto = Column(String)
    objetivo = Column(String)
    rubro = Column(String)
    actividad = Column(String)
    indicador = Column(String)
    meta = Column(String)
    valor = Column(Float)
    responsable = Column(String)
    fecha_inicio = Column(Date)
    fecha_fin = Column(Date)