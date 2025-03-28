import pandas as pd
import mysql.connector

db_config = {
	"host": "localhost",
	"user": "root",
	"password": "",
	"database": "excel_data"
}

def conectar_mysql():
	"""Establece la conexión a mysql."""
	return mysql.connector.connect(**db_config)

def guardar_archivo(nombre_archivo):
	"""Guarda la referencia del archivo en la base de datos."""
	conn = conectar_mysql()
	cursor = conn.cursor()
	cursor.execute("INSERT INTO files (nombre) VALUES (%s)", (nombre_archivo, ))
	conn.commit()
	file_id = cursor.lastrowid
	cursor.close()
	conn.close()
	return file_id

def guardar_hoja(file_id, nombre_hoja):
	"""Guarda la referencia de la hoja en la base de datos."""
	conn = conectar_mysql()
	cursor = conn.cursor()
	cursor.execute("INSERT INTO sheets (file_id, nombre) VALUES (%s, %s)", (file_id, nombre_hoja))
	conn.commit()
	sheet_id = cursor.lastrowid
	cursor.close()
	conn.close()
	return sheet_id

def guardar_datos(sheet_id, df):
	"""Guarda los datos de la hoja en la base de datos."""
	conn = conectar_mysql()
	cursor = conn.cursor()

	for _, row in df.iterrows():
		for columna, valor in row.items():
			if pd.notna(valor):
				cursor.execute("INSERT INTO data (sheet_id, columna, valor) VALUES (%s, %s, %s)",
				(sheet_id, columna, str(valor)))

	conn.commit()
	cursor.close()
	conn.close()

def procesar_excel(ruta_archivo):
	"""Procesa el archivo excel e inserta los datos en mysql."""
	print("Procesando archivo: {ruta_archivo}")


	file_id = guardar_archivo(ruta_archivo.split("/")[-1])
	xls = pd.ExcelFile(ruta_archivo)

	for sheet_name in xls.sheet_names:
		print("Procesando hoja: {sheet_name}")

		sheet_id = guardar_hoja(file_id, sheet_name)
		df = pd.read_excel(ruta_archivo, sheet_name=sheet_name, dtype=str)
		df = df.replace("nan", "").dropna(how="all")
		guardar_datos(sheet_id, df)
		
	print("Carga finalizada.")

procesar_excel("Ejecución Vs Compromisos 2024.xlsx")
procesar_excel("Plan Accion Sec Planeacion 2025 RevPROSP (1).xlsx")