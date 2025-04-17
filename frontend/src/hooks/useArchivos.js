import { useState } from 'react';
import axios from 'axios';

const API_URL = 'https://backend-flask-0rnq.onrender.com';

const useArchivos = () => {
  const [archivos, setArchivos] = useState([]);
  const [archivoSeleccionado, setArchivoSeleccionado] = useState('');
  const [hojasSeleccionadas, setHojasSeleccionadas] = useState([]);
  const [hojasPorArchivo, setHojasPorArchivo] = useState({});
  const [datosPorArchivo, setDatosPorArchivo] = useState({});
  const [columnasPorArchivo, setColumnasPorArchivo] = useState({});

  const cargarArchivos = async (nombresArchivos) => {
    try {
      setArchivos(nombresArchivos);
      const hojasPorArchivoTemp = {};
      for (let nombre of nombresArchivos) {
        const response = await axios.get(`${API_URL}/hojas/${nombre}`);
        hojasPorArchivoTemp[nombre] = response.data.hojas || [];
      }
      setHojasPorArchivo(hojasPorArchivoTemp);
    } catch (error) {
      console.error('Error al obtener hojas de archivos:', error);
    }
  };

  const obtenerDatos = async (nombreArchivo, hojas) => {
    try {
      const datosPorHoja = {};
      for (let hoja of hojas) {
        const response = await axios.get(`${API_URL}/leer/${nombreArchivo}/${hoja}`);
        datosPorHoja[hoja] = response.data.datos || [];
      }

      setDatosPorArchivo((prev) => ({
        ...prev,
        [nombreArchivo]: {
          ...(prev[nombreArchivo] || {}),
          ...datosPorHoja
        }
      }));

      const primeraHoja = hojas[0];
      if (datosPorHoja[primeraHoja]?.length > 0) {
        setColumnasPorArchivo((prev) => ({
          ...prev,
          [nombreArchivo]: Object.keys(datosPorHoja[primeraHoja][0])
        }));
      }

    } catch (error) {
      console.error('Error al obtener datos del archivo:', error);
    }
  };

  const datosCombinados = () => {
    if (!archivoSeleccionado || !hojasSeleccionadas.length) return [];

    const datosArchivo = datosPorArchivo[archivoSeleccionado] || {};
    const datos = hojasSeleccionadas.flatMap(
      (hoja) => datosArchivo[hoja] || []
    );

    return datos;
  };

  return {
    archivos,
    archivoSeleccionado,
    setArchivoSeleccionado,
    hojasSeleccionadas,
    setHojasSeleccionadas,
    hojasPorArchivo,
    datosPorArchivo,
    columnasPorArchivo,
    obtenerDatos,
    datosCombinados,
    setArchivos,
    cargarArchivos
  };
};

export default useArchivos;