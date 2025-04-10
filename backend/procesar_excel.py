import os
import pandas as pd
from extensions import db  
from database.models import Archivo, Hoja, Data

UPLOAD_FOLDER = "uploads/"  

def limpiar_nombre_hoja(nombre):
    return nombre.strip().replace(" ", "_").lower()

def limpiar_nombre_columna(columna):
    return columna.strip().replace(" ", "_").replace(":", "").replace("-", "_").lower()

def procesar_excel(nombre_archivo, app, hoja_nombre=None):
    ruta_archivo = os.path.join(UPLOAD_FOLDER, nombre_archivo)
    if not os.path.exists(ruta_archivo):
        print(f"Error: El archivo '{nombre_archivo}' no se encontró.")
        return

    try:
        with app.app_context():
            excel = pd.ExcelFile(ruta_archivo)
            hojas = excel.sheet_names
            hojas_a_procesar = [hoja_nombre] if hoja_nombre and hoja_nombre in hojas else hojas

            nuevo_archivo = Archivo(nombre=nombre_archivo)
            db.session.add(nuevo_archivo)
            db.session.commit()

            for hoja in hojas_a_procesar:
                nombre_hoja = limpiar_nombre_hoja(hoja)
                df = pd.read_excel(excel, sheet_name=hoja)
                df.columns = [limpiar_nombre_columna(col) for col in df.columns]
                print(f"Procesando hoja: {nombre_hoja}, Columnas: {df.columns}")

                nueva_hoja = Hoja(nombre=nombre_hoja, archivo_id=nuevo_archivo.id)
                db.session.add(nueva_hoja)
                db.session.commit()

                for _, row in df.iterrows():
                    for columna, valor in row.items():
                        if pd.notna(valor) and str(valor).strip().lower() not in ["", "nan"]:
                            nuevo_dato = Data(
                                sheet_id=nueva_hoja.id,  
                                columna=columna,
                                valor=str(valor)
                            )
                            db.session.add(nuevo_dato)
                db.session.commit()
                print(f"Hoja '{nombre_hoja}' procesada correctamente.")
    except Exception as e:
        print(f"Error al procesar '{nombre_archivo}': {str(e)}")

if __name__ == "__main__":
    from app import app
    archivos = os.listdir(UPLOAD_FOLDER)
    if not archivos:
        print("No hay archivos en la carpeta 'uploads/'.")
    else:
        for archivo in archivos:
            procesar_excel(archivo, app)