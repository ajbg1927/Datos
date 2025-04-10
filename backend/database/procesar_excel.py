import os
import pandas as pd
from io import BytesIO
from database.db import db
from database.models import Archivo, Hoja, Datos

UPLOAD_FOLDER = "uploads/"

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in {"xls", "xlsx"}

def limpiar_nombre_hoja(nombre):
    return nombre.strip().replace(" ", "_").lower()

def limpiar_nombre_columna(columna):
    return columna.strip().replace(" ", "_").replace(":", "").replace("-", "_").lower()

def procesar_excel(nombre_archivo=None, app=None, file_bytes=None, hoja_nombre=None):
    try:
        if file_bytes:
            excel = pd.ExcelFile(BytesIO(file_bytes))
        else:
            ruta_archivo = os.path.join(UPLOAD_FOLDER, nombre_archivo)
            if not os.path.exists(ruta_archivo):
                return {"error": f"El archivo '{nombre_archivo}' no se encontró."}
            excel = pd.ExcelFile(ruta_archivo)

        hojas = excel.sheet_names
        hojas_a_procesar = [hoja_nombre] if hoja_nombre and hoja_nombre in hojas else hojas
        
        nuevo_archivo = Archivo(nombre=nombre_archivo)
        db.session.add(nuevo_archivo)
        db.session.commit()

        for hoja in hojas_a_procesar:
            df = pd.read_excel(excel, sheet_name=hoja, dtype=str)
            df.dropna(how="all", inplace=True)

            nueva_hoja = Hoja(nombre=hoja, archivo_id=nuevo_archivo.id)
            db.session.add(nueva_hoja)
            db.session.commit()

            for _, row in df.iterrows():
                for columna, valor in row.items():
                    if pd.notna(valor) and str(valor).strip().lower() not in ["", "nan"]:
                        dato = Datos(
                            hoja_id=nueva_hoja.id,
                            columna=str(columna),
                            valor=str(valor)
                        )
                        db.session.add(dato)

        db.session.commit()
        return {"mensaje": f"Archivo '{nombre_archivo}' procesado correctamente."}

    except Exception as e:
        db.session.rollback()
        return {"error": f"Error al procesar el archivo: {str(e)}"}


if __name__ == "__main__":
    from app import app
    with app.app_context():
        archivos = os.listdir(UPLOAD_FOLDER)
        if not archivos:
            print("No hay archivos en la carpeta 'uploads/'.")
        else:
            for archivo in archivos:
                if allowed_file(archivo):
                    resultado = procesar_excel(nombre_archivo=archivo, app=app)
                    print(resultado)
