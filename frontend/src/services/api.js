import axios from 'axios';

const API_BASE_URL = 'https://backend-flask-0rnq.onrender.com';

export const subirArchivoExcel = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await axios.post(`${API_BASE_URL}/subir`, formData);
  return response.data;
};

export const getAvailableFiles = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/archivos`);
    return response.data.archivos;
  } catch (error) {
    throw new Error(`Error al obtener archivos disponibles: ${error.message}`);
  }
};

export const obtenerHojas = async (filename) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/get_sheets/${filename}`);
    return response.data.sheet_names;
  } catch (error) {
    throw new Error(`Error al obtener hojas: ${error.message}`);
  }
};

export const obtenerDatos = async (filename, sheetName) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/read_sheet`, {
      params: { filename, sheet_name: sheetName }
    });
    return response.data.data;
  } catch (error) {
    throw new Error(`Error al obtener datos: ${error.message}`);
  }
};

export const obtenerArchivos = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/available_files`);
    return response.data.files;
  } catch (error) {
    throw new Error(`Error al obtener archivos disponibles: ${error.message}`);
  }
};