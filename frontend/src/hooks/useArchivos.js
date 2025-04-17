import { useState } from 'react';
import axios from 'axios';

const API_URL = 'https://backend-flask-0rnq.onrender.com';

const useArchivos = () => {
  const [archivos, setArchivos] = useState([]); // [{ nombreOriginal, nombreBackend, hojas }]
  const [archivoSeleccionado, setArchivoSeleccionado] = useState('');
  const [hojasSeleccionadas, setHojasSeleccionadas] = useState([]);
  const [hojasPorArchivo, setHojasPorArchivo] = useState({});
  const [datosPorArchivo, setDatosPorArchivo] = useState({});
  const [columnasPorArchivo, setColumnasPorArchivo] = useState({});

  const cargarArchivos = async (archivosInput) => {
    const nuevosArchivos = [];

    for (const archivo of archivosInput) {
      const formData = new FormData();
      formData.append('archivo', archivo);

      try {
        const subida = await axios.post(`${API_URL}/subir`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        const nombreBackend = subida.data.nombre;
        const nombreOriginal = archivo.name;

        const nombreCodificado = encodeURIComponent(nombreBackend);
        const hojas = await axios.get(`${API_URL}/hojas/${nombreCodificado}`);

        nuevosArchivos.push({
          nombreOriginal,
          nombreBackend,
          hojas: hojas.data.hojas || [],
        });

        setHojasPorArchivo((prev) => ({
          ...prev,
          [nombreBackend]: hojas.data.hojas || [],
        }));

      } catch (error) {
        console.error('Error al subir o leer hojas del archivo:', error);
      }
    }

    setArchivos((prev) => [...prev, ...nuevosArchivos]);
  };

  const obtenerDatos = async (nombreBackend, hojas) => {
    try {
      const nombreCodificado = encodeURIComponent(nombreBackend);
      const response = await axios.post(`${API_URL}/datos/${nombreCodificado}`, {
        hojas,
      });

      const datos = response.data.datos || [];

      setDatosPorArchivo((prev) => ({
        ...prev,
        [nombreBackend]: {
          ...(prev[nombreBackend] || {}),
          combinado: datos,
        },
      }));

      if (datos.length > 0) {
        setColumnasPorArchivo((prev) => ({
          ...prev,
          [nombreBackend]: Object.keys(datos[0]),
        }));
      }

    } catch (error) {
      console.error('Error al obtener datos del archivo:', error);
    }
  };

  const datosCombinados = () => {
    if (!archivoSeleccionado || !hojasSeleccionadas.length) return [];

    const datosArchivo = datosPorArchivo[archivoSeleccionado] || {};
    return datosArchivo.combinado || [];
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
    cargarArchivos,
  };
};

export default useArchivos;