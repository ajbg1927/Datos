from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base
 from database.db import db

class Archivo(db.Model):
    __tablename__ = 'archivos'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String, nullable=False)
    hojas = db.relationship("Hoja", backref="archivo", lazy=True)

class Hoja(db.Model):
    __tablename__ = 'hojas'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String, nullable=False)
    archivo_id = db.Column(db.Integer, db.ForeignKey('archivos.id'), nullable=False)
    datos = db.relationship("Datos", backref="hoja", lazy=True)

class Datos(db.Model):
    __tablename__ = 'datos'
    id = db.Column(db.Integer, primary_key=True)
    hoja_id = db.Column(db.Integer, db.ForeignKey('hojas.id'), nullable=False)
    columna = db.Column(db.String)
    valor = db.Column(db.Text)

class DatosExcel(db.Model):
    __tablename__ = 'datos_excel'
    id = db.Column(db.Integer, primary_key=True)
    nombre_archivo = db.Column(db.String)
    nombre_hoja = db.Column(db.String)
    columna = db.Column(db.String)
    valor = db.Column(db.String)