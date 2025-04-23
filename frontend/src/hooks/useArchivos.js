import { useState } from 'react';
import axios from 'axios';

const API_URL = 'https://backend-flask-u76y.onrender.com';

const useArchivos = () => {
  const [archivos, setArchivos] = useState([]);
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
  const [hojasSeleccionadas, setHojasSeleccionadas] = useState([]);
  const [hojasPorArchivo, setHojasPorArchivo] = useState({});
  const [datosPorArchivo, setDatosPorArchivo] = useState({});
  const [columnasPorArchivo, setColumnasPorArchivo] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const reset = () => {
    setArchivos([]);
    setArchivoSeleccionado(null);
    setHojasSeleccionadas([]);
    setHojasPorArchivo({});
    setDatosPorArchivo({});
    setColumnasPorArchivo({});
    setError(null);
    setLoading(false);
  };

  const cargarArchivos = async (archivosInput) => {
    if (!archivosInput || archivosInput.length === 0) {
      alert("No se seleccionaron archivos.");
      return;
    }

    const formData = new FormData();
    archivosInput.forEach((archivo) => {
      formData.append('archivos', archivo);
    });

    try {
      setLoading(true);
      const respuesta = await axios.post(`${API_URL}/subir`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const nombresBackend = respuesta.data.archivos || [];
      const nuevosArchivos = [];

      for (let i = 0; i < archivosInput.length; i++) {
        const archivo = archivosInput[i];
        const nombreOriginal = archivo.name;
        const nombreBackend = nombresBackend[i];

        const nombreCodificado = encodeURIComponent(nombreBackend);
        const respuestaHojas = await axios.get(`${API_URL}/hojas/${nombreCodificado}`);
        const hojas = respuestaHojas.data.hojas || [];

        nuevosArchivos.push({
          nombreOriginal,
          nombreBackend,
          archivo,
          hojas,
        });

        setHojasPorArchivo((prev) => ({
          ...prev,
          [nombreBackend]: hojas,
        }));
      }

      setArchivos((prev) => [...prev, ...nuevosArchivos]);
      if (nuevosArchivos.length > 0) {
        setArchivoSeleccionado(nuevosArchivos[0]);
        setHojasSeleccionadas([]);
      }
    } catch (err) {
      console.error('Error al cargar archivos:', err);
      alert(`Error al cargar archivos: ${err?.response?.data?.error || 'Error inesperado'}`);
      setError(err.message || 'Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  const obtenerDatos = async (nombreBackend, hojas) => {
    if (!nombreBackend || !Array.isArray(hojas) || hojas.length === 0) {
      alert('Por favor selecciona al menos una hoja.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${API_URL}/archivos/datos`,
        { filename: nombreBackend, hojas },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const datos = response.data.datos || [];

      setDatosPorArchivo((prev) => ({
        ...prev,
        [nombreBackend]: {
          ...prev[nombreBackend],
          combinado: datos,
        },
      }));

      if (datos.length > 0) {
        setColumnasPorArchivo((prev) => ({
          ...prev,
          [nombreBackend]: Object.keys(datos[0]),
        }));
      }
    } catch (err) {
      console.error('Error al obtener datos:', err);
      alert(`Error al obtener datos: ${err?.response?.data?.error || 'Error inesperado'}`);
    } finally {
      setLoading(false);
    }
  };

  const datosCombinados = () => {
    if (!archivoSeleccionado || hojasSeleccionadas.length === 0) return [];
    const datosArchivo = datosPorArchivo[archivoSeleccionado.nombreBackend] || {};
    return datosArchivo.combinado || [];
  };

  const procesarExcel = async ({ archivo, hoja = 'Hoja1', dependencia = '' }) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('archivo', archivo);
      formData.append('hoja', hoja);
      if (dependencia) formData.append('dependencia', dependencia);

      const response = await axios.post(`${API_URL}/procesar_excel`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const { tablas } = response.data;
      setDatosPorArchivo((prev) => ({
        ...prev,
        [archivo.name]: tablas,
      }));

      return tablas;
    } catch (error) {
      console.error('Error procesando el Excel:', error);
      setError('Error procesando el archivo');
      return null;
    } finally {
      setLoading(false);
    }
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
    cargarArchivos,
    obtenerDatos,
    datosCombinados,
    procesarExcel,
    loading,
    error,
    reset,
    setArchivos,
  };
};

export default useArchivos;