import os
import pandas as pd
from flask import Flask
from database import db
from database.models import Data
from app import app  
from database.models import DatosExcel

UPLOAD_FOLDER = "uploads/"  

with app.app_context():

    datos = DatosExcel.query.all()
    for dato in datos:
        print(dato.nombre, dato.dato)

def limpiar_nombre_hoja(nombre):
    return nombre.strip().replace(" ", "_").lower()

def limpiar_nombre_columna(columna):
    return columna.strip().replace(" ", "_").replace(":", "").replace("-", "_").lower()

def procesar_excel(filepath, hoja_nombre=None):
    excel_data = pd.read_excel(filepath, sheet_name=hoja_nombre if hoja_nombre else None)

    if not os.path.exists(ruta_archivo):
        print(f"Error: El archivo '{nombre_archivo}' no se encontró.")
        return

    try:
        with app.app_context():
            excel = pd.ExcelFile(ruta_archivo)
            hojas = excel.sheet_names

            if hoja_nombre and hoja_nombre in hojas:
                hojas_a_procesar = [hoja_nombre]
            else:
                hojas_a_procesar = hojas

            for hoja in hojas_a_procesar:
                nombre_hoja = limpiar_nombre_hoja(hoja)
                df = pd.read_excel(excel, sheet_name=hoja)

                df.columns = [limpiar_nombre_columna(col) for col in df.columns]
                print(f"Procesando hoja: {nombre_hoja}, Columnas: {df.columns}")

                for index, row in df.iterrows():
                    for columna, valor in row.items():
                        if pd.notna(valor) and valor not in ["", "nan"]:
                            nuevo_dato = Data(
                                sheet_id=nombre_hoja,
                                columna=columna,
                                valor=str(valor)
                            )
                            db.session.add(nuevo_dato)

                db.session.commit()
                print(f"Hoja '{nombre_hoja}' procesada correctamente.")

    except Exception as e:
        print(f"Error al procesar '{nombre_archivo}': {str(e)}")


if __name__ == "__main__":
    archivos = os.listdir(UPLOAD_FOLDER)

    if not archivos:
        print("No hay archivos en la carpeta 'uploads/'.")
    else:
        for archivo in archivos:
            procesar_excel(archivo)