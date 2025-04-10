from flask import Blueprint, request, jsonify, current_app
from flask_restful import Api, Resource
from werkzeug.utils import secure_filename
import os
import pandas as pd
from database.models import Datos

api_bp = Blueprint("api", __name__)
api = Api(api_bp)

UPLOAD_FOLDER = "uploads"
ALLOWED_EXTENSIONS = {"xlsx"}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

class SubirArchivo(Resource):
    def post(self):
        if "archivo" not in request.files:
            return {"error": "No se encontró el archivo"}, 400

        archivo = request.files["archivo"]
        if archivo.filename == "" or not allowed_file(archivo.filename):
            return {"error": "Archivo inválido"}, 400

        filename = secure_filename(archivo.filename)
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        archivo.save(filepath)

        try:
            hojas = pd.ExcelFile(filepath).sheet_names
            return {"mensaje": "Archivo subido correctamente", "nombre": filename, "hojas": hojas}, 200
        except Exception as e:
            return {"error": f"Error al leer el archivo: {str(e)}"}, 500

class ObtenerDatos(Resource):
    def get(self):
        datos = Datos.query.all()
        return {"mensaje": "Datos obtenidos correctamente", "datos": [d.to_dict() for d in datos]}, 200

class Prueba(Resource):
    def get(self):
        return {"mensaje": "API funcionando correctamente"}

@api_bp.route("/procesar_excel", methods=["POST"])
def procesar_excel_endpoint():
    data = request.get_json()
    nombre_archivo = data.get("nombre")
    if not nombre_archivo:
        return jsonify({"error": "No se proporcionó el nombre del archivo"}), 400

    try:
        return jsonify({"mensaje": "Archivo procesado correctamente"}), 200
    except Exception as e:
        return jsonify({"error": f"Error al procesar el archivo: {str(e)}"}), 500

@api_bp.route("/datos/<filename>", methods=["POST"])
def datos_por_hojas(filename):
    filepath = os.path.join(UPLOAD_FOLDER, secure_filename(filename))
    if not os.path.exists(filepath):
        return jsonify({"error": "El archivo no existe"}), 404

    try:
        hojas = request.json.get("hojas", [])
        xls = pd.ExcelFile(filepath)
        datos_totales = []
        row_id = 1
        for hoja in hojas:
            if hoja not in xls.sheet_names:
                continue
            df = pd.read_excel(xls, sheet_name=hoja, dtype=str).dropna(how="all")
            df.insert(0, "id", range(row_id, row_id + len(df)))
            row_id += len(df)
            df["Hoja"] = hoja
            datos_totales.extend(df.fillna("").to_dict(orient="records"))
        return jsonify({"datos": datos_totales})
    except Exception as e:
        return jsonify({"error": f"Error al procesar hojas: {str(e)}"}), 500

api.add_resource(SubirArchivo, "/subir")
api.add_resource(ObtenerDatos, "/datos")
api.add_resource(Prueba, "/prueba")