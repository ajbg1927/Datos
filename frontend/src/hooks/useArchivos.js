import { useState } from 'react';
import axios from 'axios';

const API_URL = 'https://backend-flask-0rnq.onrender.com';

const useArchivos = () => {
  const [archivos, setArchivos] = useState([]);
  const [datosPorArchivo, setDatosPorArchivo] = useState({});
  const [columnasPorArchivo, setColumnasPorArchivo] = useState({});
  const [hojasPorArchivo, setHojasPorArchivo] = useState({});
  const [archivoSeleccionado, setArchivoSeleccionado] = useState('');
  const [hojasSeleccionadas, setHojasSeleccionadas] = useState([]);

  const cargarArchivos = async (archivos) => {
    const formData = new FormData();
    for (let archivo of archivos) {
      formData.append('files', archivo);
    }

    try {
      const response = await axios.post(`${API_URL}/cargar`, formData);
      const archivosCargados = response.data.archivos || [];
      const hojas = response.data.hojas || {};

      setArchivos(archivosCargados);
      setHojasPorArchivo(hojas);
    } catch (error) {
      console.error('Error al cargar archivos:', error);
    }
  };

  const obtenerDatos = async (archivo, hojasSeleccionadas) => {
    if (!archivo || hojasSeleccionadas.length === 0) return;

    if (datosPorArchivo[archivo] && columnasPorArchivo[archivo]) {
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/datos/${archivo}`,
        { hojas: hojasSeleccionadas },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const datos = response.data.datos || [];
      const columnas = response.data.columnas || [];

      setDatosPorArchivo((prev) => ({ ...prev, [archivo]: datos }));
      setColumnasPorArchivo((prev) => ({ ...prev, [archivo]: columnas }));
    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
  };

  const datosCombinados = () => {
    if (!archivoSeleccionado || hojasSeleccionadas.length === 0) return [];
    return datosPorArchivo[archivoSeleccionado] || [];
  };

  return {
    archivos,
    datosPorArchivo,
    columnasPorArchivo,
    hojasPorArchivo,
    archivoSeleccionado,
    setArchivoSeleccionado,
    hojasSeleccionadas,
    setHojasSeleccionadas,
    cargarArchivos,
    obtenerDatos,
    datosCombinados
  };
};

export default useArchivos;