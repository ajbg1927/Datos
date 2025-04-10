from flask import Blueprint, request
from utils.excel_loader import procesar_excel

api = Blueprint('api', __name__)

@api.route('/datos/<filename>', methods=['POST'])
def cargar_datos(filename):
    if 'file' not in request.files:
        return {"error": "No se envió archivo"}, 400

    file = request.files['file']
    return procesar_excel(file)