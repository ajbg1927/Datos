from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
from fpdf import FPDF
from database.db import db
from database.models import Archivo, Hoja, Datos, DatosExcel
from database.procesar_excel import procesar_excel
from config import Config
from routes import api_bp
from utils.excel_parser import extraer_tablas_relevantes
import pandas as pd
import os

load_dotenv()

app = Flask(__name__)
app.config.from_object(Config)

CORS(app, supports_credentials=True, origins=[
    "https://datosexcel.vercel.app", "http://localhost:3000"
])

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("Falta la variable de entorno DATABASE_URL")
app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)
migrate = Migrate(app, db)

app.register_blueprint(api_bp, url_prefix="/api")

UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")
ALLOWED_EXTENSIONS = {"xls", "xlsx"}
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/")
def home():
    return "Flask en Render funcionando"

@app.route("/prueba")
def prueba():
    return {"mensaje": "Conexión exitosa"}

@app.route("/subir", methods=["POST"])
def subir_archivo():
    archivos = request.files.getlist("archivos")

    if not archivos:
        print("No llegaron archivos en la solicitud.")
        return jsonify({"error": "No se enviaron archivos"}), 400

    nombres_guardados = []
    for file in archivos:
        print("Recibido:", file.filename)

        if file.filename == "" or not allowed_file(file.filename):
            print("Archivo inválido o formato no permitido:", file.filename)
            return jsonify({"error": f"Formato no permitido para {file.filename}"}), 400

        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)

        try:
            file.save(filepath)
            nombres_guardados.append(filename)
        except Exception as e:
            print("Error al guardar:", str(e))
            return jsonify({"error": f"No se pudo guardar {file.filename}: {str(e)}"}), 500

    print("Archivos guardados:", nombres_guardados)
    return jsonify({"mensaje": "Archivos subidos exitosamente", "archivos": nombres_guardados})

@app.route("/upload", methods=["POST"])
def upload_file():
    if 'archivo' not in request.files:
        return jsonify({'error': 'No se envió archivo'}), 400
    archivo = request.files['archivo']
    if archivo.filename == '':
        return jsonify({'error': 'Nombre de archivo vacío'}), 400

    filename = secure_filename(archivo.filename)
    path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    archivo.save(path)

    return jsonify({'mensaje': 'Archivo subido exitosamente', 'archivo': filename}), 200

@app.route("/archivos", methods=["GET"])
def listar_archivos():
    archivos = os.listdir(app.config["UPLOAD_FOLDER"])
    return jsonify({"archivos": archivos})

@app.route("/hojas/<filename>", methods=["GET"])
def obtener_hojas(filename):
    filename = secure_filename(filename)
    filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)

    print("→ Solicitando hojas del archivo:", filename)
    print("→ Archivos disponibles en /tmp:", os.listdir(app.config["UPLOAD_FOLDER"]))

    if not os.path.exists(filepath):
        return jsonify({"error": "Archivo no encontrado"}), 404

    try:
        xls = pd.ExcelFile(filepath)
        return jsonify({"hojas": xls.sheet_names})
    except Exception as e:
        return jsonify({"error": f"Error al leer el archivo: {str(e)}"}), 500

@app.route("/datos/<filename>", methods=["POST"])
def obtener_datos(filename):
    filename = secure_filename(filename)
    filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)

    if not os.path.exists(filepath):
        return jsonify({"error": "Archivo no encontrado"}), 404

    try:
        print(f"Datos recibidos: {request.json}")

        hojas = request.json.get("hojas", [])
        if not hojas:
            return jsonify({"error": "No se especificaron hojas"}), 400

        xls = pd.ExcelFile(filepath)
        datos_totales = []
        row_id = 1

        for hoja in hojas:
            if hoja not in xls.sheet_names:
                return jsonify({"error": f"La hoja '{hoja}' no existe en el archivo"}), 400
            df = pd.read_excel(xls, sheet_name=hoja, dtype=str)
            df.dropna(how="all", inplace=True)
            df.insert(0, "id", range(row_id, row_id + len(df)))
            row_id += len(df)
            df["Hoja"] = hoja
            datos_totales.extend(df.fillna("").to_dict(orient="records"))

        return jsonify({"datos": datos_totales})
    except Exception as e:
        return jsonify({"error": f"Error al leer los datos: {str(e)}"}), 500

@app.route("/archivos/datos", methods=["POST"])
def obtener_datos_archivo():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No se recibieron datos en la solicitud"}), 400

    filename = data.get("filename")
    hojas = data.get("hojas")

    if not filename:
        return jsonify({"error": "Nombre de archivo no proporcionado"}), 400
    if not hojas or not isinstance(hojas, list):
        return jsonify({"error": "Lista de hojas no proporcionada o inválida"}), 400

    try:
        filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        if not os.path.exists(filepath):
            return jsonify({"error": f"Archivo '{filename}' no encontrado"}), 404

        xls = pd.ExcelFile(filepath)
        datos_totales = []
        row_id = 1

        for hoja in hojas:
            if hoja in xls.sheet_names:
                try:
                    df = pd.read_excel(xls, sheet_name=hoja, dtype=str)
                    df.fillna("", inplace=True)
                    df.insert(0, "id", range(row_id, row_id + len(df)))
                    row_id += len(df)
                    df["Hoja"] = hoja
                    datos_totales.extend(df.to_dict(orient="records"))
                except Exception as e:
                    return jsonify({"error": f"Error al leer la hoja '{hoja}': {str(e)}"}), 500

        return jsonify({"datos": datos_totales})
    except Exception as e:
        return jsonify({"error": f"Error al procesar el archivo '{filename}': {str(e)}"}), 500

@app.route("/datos", methods=["POST"])
def procesar_datos_endpoint():
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

@app.route('/cargar', methods=['POST'])
def cargar():
    archivos = request.files.getlist("archivos")
    data = []

    for archivo in archivos:
        filename = archivo.filename
        filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        archivo.save(filepath)

        try:
            xls = pd.ExcelFile(filepath)
            hojas = {}
            for hoja in xls.sheet_names:
                df = xls.parse(hoja)
                hojas[hoja] = df.to_dict(orient="records")
            data.append({
                "nombre_archivo": filename,
                "hojas": hojas
            })
        except Exception as e:
            return jsonify({"error": str(e)}), 400

    return jsonify(data)

@app.route("/procesar_excel", methods=["POST"])
def procesar_excel_endpoint():
    if 'nombreBackend' not in request.form or 'hojas' not in request.form:
        return jsonify({'error': 'Falta el nombre del archivo o la lista de hojas'}), 400

    nombre_archivo_backend = request.form['nombreBackend']
    hojas_a_procesar = json.loads(request.form['hojas'])
    filtro_dependencia = request.form.get('dependencia')
    ruta_archivo = os.path.join(app.config['UPLOAD_FOLDER'], nombre_archivo_backend)

    resultados = {}
    for nombre_hoja in hojas_a_procesar:
        try:
            tablas = extraer_tablas_relevantes(ruta_archivo, nombre_hoja, filtro_dependencia)
            resultados[nombre_hoja] = tablas
        except Exception as e:
            resultados[nombre_hoja] = {"error": f"Error al procesar la hoja '{nombre_hoja}': {str(e)}"}

    return jsonify({'tablas_por_hoja': resultados})

@app.route("/generate-report", methods=["POST"])
def generate_report():
    try:
        data = request.json.get("data", [])
        if not data:
            return jsonify({"error": "No hay datos para generar el informe"}), 400

        df = pd.DataFrame(data)

        excel_path = os.path.join(app.config["UPLOAD_FOLDER"], "reporte.xlsx")
        pdf_path = os.path.join(app.config["UPLOAD_FOLDER"], "reporte.pdf")

        df.to_excel(excel_path, index=False)

        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Arial", style='B', size=16)
        pdf.cell(200, 10, "Informe de Datos", ln=True, align='C')
        pdf.ln(10)

        for index, row in df.iterrows():
            for col in df.columns:
                pdf.cell(100, 10, f"{col}: {row[col]}", ln=True)

        pdf.output(pdf_path)

        return jsonify({
            "excel": excel_path,
            "pdf": pdf_path
        })
    except Exception as e:
        return jsonify({"error": f"Error al generar el informe: {str(e)}"}), 500

@app.route("/download/<filename>", methods=["GET"])
def download_file(filename):
    file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
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
        archivos_info = []
        for archivo in os.listdir(UPLOAD_FOLDER):
            filepath = os.path.join(UPLOAD_FOLDER, archivo)
            if os.path.isfile(filepath) and allowed_file(archivo):
                try:
                    xls = pd.ExcelFile(filepath)
                    archivos_info.append({
                        "archivo": archivo,
                        "hojas": xls.sheet_names
                    })
                except Exception as e:
                    archivos_info.append({
                        "archivo": archivo,
                        "error": f"No se pudo leer: {str(e)}"
                    })

        return jsonify({"archivos": archivos_info})
    except Exception as e:
        return jsonify({"error": f"Error al listar archivos: {str(e)}"}), 500

def procesar_todos_los_archivos():
    archivos = os.listdir(UPLOAD_FOLDER)
    if not archivos:
        print("No hay archivos en la carpeta '/uploads'.")
        return
    for archivo in archivos:
        try:
            procesar_excel(archivo)
        except Exception as e:
            print(f"Error al procesar el archivo {archivo}: {e}")

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