import os
import pandas as pd
import mysql.connector


db_config = {
    "host": os.environ.get("DB_HOST", "localhost"),
    "user": os.environ.get("DB_USER", "root"),
    "password": os.environ.get("DB_PASSWORD", ""),
    "database": os.environ.get("DB_NAME", "excel_data")
}

def conectar_mysql():
    return mysql.connector.connect(**db_config)

def guardar_archivo(nombre_archivo):
    conn = conectar_mysql()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO files (nombre) VALUES (%s)", (nombre_archivo,))
    conn.commit()
    file_id = cursor.lastrowid
    cursor.close()
    conn.close()
    return file_id

def guardar_hoja(file_id, nombre_hoja):
    conn = conectar_mysql()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO sheets (file_id, nombre) VALUES (%s, %s)", (file_id, nombre_hoja))
    conn.commit()
    sheet_id = cursor.lastrowid
    cursor.close()
    conn.close()
    return sheet_id

def guardar_datos(sheet_id, df):
    conn = conectar_mysql()
    cursor = conn.cursor()

    for _, row in df.iterrows():
        for columna, valor in row.items():
            if pd.notna(valor) and str(valor).strip() != "":
                cursor.execute("INSERT INTO data (sheet_id, columna, valor) VALUES (%s, %s, %s)",
                               (sheet_id, columna, str(valor)))

    conn.commit()
    cursor.close()
    conn.close()

def procesar_excel(ruta_archivo):
    if not os.path.exists(ruta_archivo):
        print(f"Archivo no encontrado: {ruta_archivo}")
        return

    nombre_archivo = os.path.basename(ruta_archivo)
    file_id = guardar_archivo(nombre_archivo)
    xls = pd.ExcelFile(ruta_archivo)

    for sheet_name in xls.sheet_names:
        sheet_id = guardar_hoja(file_id, sheet_name)
        df = pd.read_excel(ruta_archivo, sheet_name=sheet_name, dtype=str)
        df = df.replace("nan", "").dropna(how="all")
        guardar_datos(sheet_id, df)

    print("Carga finalizada.")