import os
import pandas as pd
from database import db
from models import Data

UPLOAD_FOLDER = "uploads/"  

def limpiar_nombre_hoja(nombre):
    return nombre.strip().replace(" ", "_").lower()

def limpiar_nombre_columna(columna):
    return columna.strip().replace(" ", "_").replace(":", "").replace("-", "_").lower()

def procesar_excel(nombre_archivo):
    ruta_archivo = os.path.join(UPLOAD_FOLDER, nombre_archivo)

    if not os.path.exists(ruta_archivo):
        return f"Error: El archivo '{nombre_archivo}' no se encontró."

    try:
        excel = pd.ExcelFile(ruta_archivo)
        hojas = excel.sheet_names

        for hoja in hojas:
            nombre_hoja = limpiar_nombre_hoja(hoja)
            df = pd.read_excel(excel, sheet_name=hoja)

            df.columns = [limpiar_nombre_columna(col) for col in df.columns]

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
        return f"Archivo '{nombre_archivo}' procesado correctamente."

    except Exception as e:
        return f"Error al procesar '{nombre_archivo}': {str(e)}"