import axios from 'axios';

const API_BASE_URL = 'https://backend-flask-u76y.onrender.com';

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

export const obtenerArchivos = async () => {
  return getAvailableFiles();
};

export const obtenerHojas = async (filename) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/hojas/${filename}`);
    return response.data.hojas;
  } catch (error) {
    throw new Error(`Error al obtener hojas: ${error.message}`);
  }
};

export const obtenerDatos = async (filename, hojas) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/datos/${filename}`, {
      hojas: hojas
    });
    return response.data.datos;
  } catch (error) {
    throw new Error(`Error al obtener datos: ${error.message}`);
  }
};