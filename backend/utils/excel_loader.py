import pandas as pd
from flask import jsonify


def detectar_tipo_archivo(nombre_archivo):
    nombre = nombre_archivo.lower()
    if "compromisos" in nombre:
        return "compromisos"
    elif "plan" in nombre:
        return "plan"
    return None


def columnas_validas(tipo, columnas):
    columnas_lower = [col.lower() for col in columnas]
    
    if tipo == "compromisos":
        requeridas = ["dependencia", "compromisos", "indicador", "meta", "logro"]
    elif tipo == "plan":
        requeridas = ["código", "proyecto", "meta producto", "indicador producto"]
    else:
        return False

    return all(any(req in col for col in columnas_lower) for req in requeridas)


def contiene_rubro(columnas):
    columnas_lower = [col.lower() for col in columnas]
    return any("rubro" in col for col in columnas_lower)


def procesar_excel(file_storage):
    nombre_archivo = file_storage.filename
    tipo = detectar_tipo_archivo(nombre_archivo)

    if not tipo:
        return jsonify({"error": "No se pudo determinar el tipo de archivo."}), 400

    try:
        xls = pd.read_excel(file_storage, sheet_name=None)
        resultado = {}

        for hoja, df in xls.items():
            columnas = df.columns.tolist()

            if not columnas_validas(tipo, columnas):
                return jsonify({"error": f"Estructura no válida para archivo tipo {tipo} en hoja '{hoja}'."}), 400

            if not contiene_rubro(columnas):
                return jsonify({"error": f"No se encontró columna relacionada con 'rubro' en hoja '{hoja}'."}), 400

            resultado[hoja] = df.fillna("").to_dict(orient="records")

        return jsonify(resultado)

    except Exception as e:
        return jsonify({"error": str(e)}), 400
