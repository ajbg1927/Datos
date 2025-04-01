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

def procesar_excel(nombre_archivo):
    print(f"Procesando archivo: {nombre_archivo}")  
    ruta_archivo = os.path.join(UPLOAD_FOLDER, nombre_archivo)

    if not os.path.exists(ruta_archivo):
        print(f"Error: El archivo '{nombre_archivo}' no se encontró.")
        return

    try:
        with app.app_context(): 
            excel = pd.ExcelFile(ruta_archivo)
            hojas = excel.sheet_names
            print(f"Hojas en el archivo: {hojas}")  

            for hoja in hojas:
                nombre_hoja = limpiar_nombre_hoja(hoja)
                df = pd.read_excel(excel, sheet_name=hoja)

                df.columns = [limpiar_nombre_columna(col) for col in df.columns]
                print(f"Procesando hoja: {nombre_hoja}, Columnas: {df.columns}")  

                for index, row in df.iterrows():
                    for columna, valor in row.items():
                        if pd.notna(valor) and valor not in ["", "nan"]:
                            print(f"Insertando: {nombre_hoja}, {columna}: {valor}")                         
                            nuevo_dato = Data(
                                sheet_id=nombre_hoja,
                                columna=columna,
                                valor=str(valor)
                            )
                            db.session.add(nuevo_dato)

                db.session.commit()
                print(f"Archivo '{nombre_archivo}' procesado correctamente.")  

    except Exception as e:
        print(f"Error al procesar '{nombre_archivo}': {str(e)}")


if __name__ == "__main__":
    archivos = os.listdir(UPLOAD_FOLDER)

    if not archivos:
        print("No hay archivos en la carpeta 'uploads/'.")
    else:
        for archivo in archivos:
            procesar_excel(archivo)