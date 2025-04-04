from flask import Flask, Blueprint, request, jsonify
from flask_cors import CORS
from flask_restful import Api, Resource
from flask_sqlalchemy import SQLAlchemy
from werkzeug.utils import secure_filename
from database import db
from database.models import Datos
import os
import pandas as pd


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
        print("Recibiendo solicitud en /subir")
        print("request.files:", request.files)
        print("request.form:", request.form)
        if "archivo" not in request.files:
            print("ERROR: No se encontró el archivo en request.files")
            return {"error": "No se encontró el archivo"}, 400
        archivo = request.files["archivo"]
        if archivo.filename == "":
            return {"error": "Nombre de archivo vacío"}, 400
        if archivo and allowed_file(archivo.filename):
            filename = secure_filename(archivo.filename)
            filepath = os.path.join(UPLOAD_FOLDER, filename)
            archivo.save(filepath)
            try:
                hojas = pd.ExcelFile(filepath).sheet_names
            except Exception as e:
                return {"error": f"Error al leer el archivo: {str(e)}"}, 500
            return {"mensaje": "Archivo subido correctamente", "nombre": filename, "hojas": hojas}, 200
        return {"error": "Formato de archivo no permitido"}, 400

class ObtenerDatos(Resource):
    def get(self):
        datos = Datos.query.all()
        resultado = [{"id": dato.id, "nombre": dato.nombre, "valor": dato.valor} for dato in datos]
        return {"mensaje": "API funcionando correctamente", "datos": resultado}

class Prueba(Resource):
    def get(self):
        return {"mensaje": "API funcionando correctamente"}

api.add_resource(SubirArchivo, "/subir")
api.add_resource(ObtenerDatos, "/api/datos")
api.add_resource(Prueba, "/prueba")


@api_bp.route("/subir", methods=["POST"])
def subir_archivo():
    print("Recibiendo solicitud en /subir")
    print("request.files:", request.files)
    print("request.form:", request.form)
    if "archivo" not in request.files:
        print("ERROR: No se encontró el archivo en request.files")
        return jsonify({"error": "No se encontró el archivo"}), 400
    archivo = request.files["archivo"]
    if archivo.filename == "":
        return jsonify({"error": "Nombre de archivo vacío"}), 400
    if archivo and allowed_file(archivo.filename):
        filename = secure_filename(archivo.filename)
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        archivo.save(filepath)
        try:
            hojas = pd.ExcelFile(filepath).sheet_names
        except Exception as e:
            return jsonify({"error": f"Error al leer el archivo: {str(e)}"}), 500
        return jsonify({"mensaje": "Archivo subido correctamente", "nombre": filename, "hojas": hojas}), 200
    return jsonify({"error": "Formato de archivo no permitido"}), 400

@api_bp.route("/api/datos", methods=["GET"])
def obtener_datos_rest():
    datos = Datos.query.all()
    resultado = [{"id": dato.id, "nombre": dato.nombre, "valor": dato.valor} for dato in datos]
    return jsonify([dato.to_dict() for dato in datos])

if __name__ == "__main__":
    app.run(debug=True)