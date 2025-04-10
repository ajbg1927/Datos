from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
from fpdf import FPDF
from database.db import db
from database.models import Archivo, Hoja, Datos, DatosExcel
from config import Config
from routes import api_bp
import pandas as pd
import os

load_dotenv()

app = Flask(__name__)
app.config.from_object(Config)

CORS(app, resources={r"/*": {"origins": [
    "https://datosexcel.vercel.app",
    "http://localhost:3000"
]}})

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("Falta la variable de entorno DATABASE_URL")
app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)
migrate = Migrate(app, db)

app.register_blueprint(api_bp, url_prefix="/api")

UPLOAD_FOLDER = "uploads"
ALLOWED_EXTENSIONS = {"xls", "xlsx"}
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=True)

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/")
def home():
    return "Flask en Render funcionando"

@app.route("/prueba")
def prueba():
    return {"mensaje": "Conexión exitosa"}

@app.route("/subir", methods=["POST"])
def subir_archivo():
    if "file" not in request.files:
        return jsonify({"error": "No se envió ningún archivo"}), 400
    file = request.files["file"]
    if file.filename == "" or not allowed_file(file.filename):
        return jsonify({"error": "Formato de archivo no permitido"}), 400
    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    file.save(filepath)
    return jsonify({"mensaje": "Archivo subido exitosamente", "archivo": filename})

@app.route("/archivos", methods=["GET"])
def listar_archivos():
    archivos = os.listdir(UPLOAD_FOLDER)
    return jsonify({"archivos": archivos})

@app.route("/hojas/<filename>", methods=["GET"])
def obtener_hojas(filename):
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    if not os.path.exists(filepath):
        return jsonify({"error": "Archivo no encontrado"}), 404
    try:
        xls = pd.ExcelFile(filepath)
        return jsonify({"hojas": xls.sheet_names})
    except Exception as e:
        return jsonify({"error": f"Error al leer el archivo: {str(e)}"}), 500

@app.route("/datos/<filename>", methods=["POST"])
def obtener_datos(filename):
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    if not os.path.exists(filepath):
        return jsonify({"error": "Archivo no encontrado"}), 404
    try:
        data = request.json
        hojas = data.get("hojas", [])
        xls = pd.ExcelFile(filepath)
        datos_totales = []
        id_counter = 1
        for hoja in hojas:
            if hoja not in xls.sheet_names:
                return jsonify({"error": f"La hoja '{hoja}' no existe"}), 400
            df = pd.read_excel(xls, sheet_name=hoja, dtype=str)
            df.dropna(how="all", inplace=True)
            df.insert(0, "id", range(id_counter, id_counter + len(df)))
            id_counter += len(df)
            df["Hoja"] = hoja
            datos_totales.extend(df.fillna("").to_dict(orient="records"))
        return jsonify({"datos": datos_totales})
    except Exception as e:
        return jsonify({"error": f"Error al leer los datos: {str(e)}"}), 500

@app.route("/archivos/datos", methods=["POST"])
def obtener_datos_archivo():
    data = request.json
    filename = data.get("filename", "")
    hojas = data.get("hojas", [])
    if not filename:
        return jsonify({"error": "Archivo no encontrado"}), 400
    try:
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        if not os.path.exists(filepath):
            return jsonify({"error": "Archivo no encontrado"}), 400
        xls = pd.ExcelFile(filepath)
        datos_totales = []
        row_id = 1
        for hoja in hojas:
            if hoja in xls.sheet_names:
                df = pd.read_excel(xls, sheet_name=hoja, dtype=str)
                df.fillna("", inplace=True)
                df.insert(0, "id", range(row_id, row_id + len(df)))
                row_id += len(df)
                df["Hoja"] = hoja
                datos_totales.extend(df.to_dict(orient="records"))
        return jsonify({"datos": datos_totales})
    except Exception as e:
        return jsonify({"error": f"Error al procesar el archivo: {str(e)}"}), 500

@app.route("/upload", methods=["POST"])
def upload_file():
    file = request.files['file']
    if file:
        filename = secure_filename(file.filename)
        file_path = os.path.join('/tmp', filename)
        file.save(file_path)
        return jsonify({"filename": filename}), 200
    return jsonify({"error": "Archivo no encontrado"}), 400

@app.route("/datos", methods=["POST"])
def procesar_excel_endpoint():
    if 'file' not in request.files:
        return jsonify({"error": "No se envió ningún archivo"}), 400
    archivo = request.files['file']
    if archivo.filename == '':
        return jsonify({"error": "Nombre de archivo vacío"}), 400
    try:
        excel_data = pd.read_excel(archivo, sheet_name=None, dtype=str)
        datos_hojas = {}
        row_id = 1
        for nombre_hoja, df in excel_data.items():
            df.dropna(how='all', inplace=True)
            if df.empty:
                continue
            df.insert(0, "id", range(row_id, row_id + len(df)))
            row_id += len(df)
            df["Hoja"] = nombre_hoja
            datos_hojas[nombre_hoja] = df.fillna('').to_dict(orient='records')
        return jsonify(datos_hojas), 200
    except Exception as e:
        return jsonify({"error": f"Error procesando el archivo: {str(e)}"}), 500

@app.route("/api/datos", methods=["GET"])
def get_datos():
    try:
        datos = DatosExcel.query.all()
        resultado = [{"id": d.id, "nombre": d.nombre, "dato": d.dato} for d in datos]
        return jsonify(resultado)
    except Exception as e:
        return jsonify({"error": f"Error al obtener datos: {str(e)}"}), 500

@app.route("/generate-report", methods=["POST"])
def generate_report():
    try:
        data = request.json.get("data", [])
        if not data:
            return jsonify({"error": "No hay datos para generar el informe"}), 400
        df = pd.DataFrame(data)
        excel_path = os.path.join(UPLOAD_FOLDER, "reporte.xlsx")
        df.to_excel(excel_path, index=False)
        pdf_path = os.path.join(UPLOAD_FOLDER, "reporte.pdf")
        pdf = FPDF()
        pdf.set_auto_page_break(auto=True, margin=15)
        pdf.add_page()
        pdf.set_font("Arial", style='B', size=16)
        pdf.cell(200, 10, "Informe de Datos", ln=True, align='C')
        pdf.ln(10)
        pdf.set_font("Arial", size=12)
        pdf.cell(0, 10, f"Total de registros: {len(df)}", ln=True)
        pdf.cell(0, 10, f"Columnas disponibles: {', '.join(df.columns)}", ln=True)
        pdf.output(pdf_path)
        return jsonify({
            "mensaje": "Informe generado exitosamente",
            "excel_url": f"/download/reporte.xlsx",
            "pdf_url": f"/download/reporte.pdf"
        })
    except Exception as e:
        return jsonify({"error": f"Error al generar el informe: {str(e)}"}), 500

@app.route("/download/<filename>", methods=["GET"])
def download_file(filename):
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    if os.path.exists(file_path):
        return send_file(file_path, as_attachment=True)
    return jsonify({"error": "Archivo no encontrado"}), 404

@app.route("/usuarios", methods=["GET"])
def get_usuarios():
    usuarios = Usuario.query.all()
    return jsonify([{"id": u.id, "nombre": u.nombre, "email": u.email} for u in usuarios])

@app.route("/archivos_detalle", methods=["GET"])
def listar_archivos_con_hojas():
    try:
        archivos = Archivo.query.all()
        resultado = []

        for archivo in archivos:
            hojas = Hoja.query.filter_by(archivo_id=archivo.id).all()
            resultado.append({
                "archivo": archivo.nombre,
                "hojas": [hoja.nombre for hoja in hojas]
            })

        return jsonify(resultado)
    except Exception as e:
        return jsonify({"error": f"Error al obtener archivos: {str(e)}"}), 500

def procesar_todos_los_archivos():
    archivos = os.listdir(app.config["UPLOAD_FOLDER"])
    if not archivos:
        print("No hay archivos en la carpeta 'uploads/'.")
    else:
        for archivo in archivos:
            procesar_excel(archivo, app)

def procesar_excel(nombre_archivo, app):
    filepath = os.path.join(app.config["UPLOAD_FOLDER"], nombre_archivo)
    if not os.path.exists(filepath):
        print(f"Archivo {nombre_archivo} no encontrado")
        return
    try:
        xls = pd.ExcelFile(filepath)
        for hoja in xls.sheet_names:
            df = pd.read_excel(xls, sheet_name=hoja, dtype=str)
            df.dropna(how="all", inplace=True)
            if df.empty:
                continue
            for _, row in df.iterrows():
                for columna, valor in row.items():
                    if columna and valor:
                        nuevo_dato = DatosExcel(nombre=columna, dato=str(valor))
                        db.session.add(nuevo_dato)
        db.session.commit()
        print(f"Archivo {nombre_archivo} procesado correctamente.")
    except Exception as e:
        print(f"Error al procesar {nombre_archivo}: {e}")


if __name__ == "__main__":  
    with app.app_context():
        db.create_all()
        procesar_todos_los_archivos()
        procesar_excel("mi_archivo.xlsx", app)
        datos = DatosExcel.query.all()
        for dato in datos:
            print(dato.nombre, dato.dato)
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=True, host="0.0.0.0", port=port)
