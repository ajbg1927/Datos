import { useState, useEffect } from 'react';
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

  const manejarError = (mensaje, error) => {
    console.error(mensaje, error);
    alert(mensaje);
    setError(mensaje);
    setLoading(false);
  };

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
    for (const archivo of archivosInput) {
      formData.append('archivos', archivo);
    }

    setLoading(true);

    try {
      const subida = await axios.post(`${API_URL}/subir`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const nombresBackend = subida.data.archivos || [];
      const nuevosArchivos = [];

      for (let i = 0; i < archivosInput.length; i++) {
        const archivo = archivosInput[i];
        const nombreOriginal = archivo.name;
        const nombreBackend = nombresBackend[i];

        const nombreCodificado = encodeURIComponent(nombreBackend);
        const hojasResponse = await axios.get(`${API_URL}/hojas/${nombreCodificado}`);
        const hojas = hojasResponse.data.hojas || [];

        nuevosArchivos.push({
          nombreOriginal,
          nombreBackend,
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
      }

      setLoading(false);

    } catch (error) {
      manejarError(
        `Error en la carga: ${error?.response?.data?.error || error?.message || 'Error inesperado'}`,
        error
      );
    }
  };

  const obtenerDatos = async (nombreBackend, hojas) => {
    if (!nombreBackend || !hojas || hojas.length === 0) {
      alert('Por favor, seleccione un archivo y las hojas correspondientes.');
      return;
    }

    const hojasLimpias = hojas.map((hoja) => hoja.trim());

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/archivos/datos`,
        {
          filename: nombreBackend,
          hojas: hojasLimpias,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

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

      setLoading(false);

    } catch (error) {
      manejarError(
        `Error al obtener datos: ${error?.response?.data?.error || error?.message || 'Error inesperado'}`,
        error
      );
    }
  };

  const datosCombinados = () => {
    if (!archivoSeleccionado || !hojasSeleccionadas.length) return [];
    const datosArchivo = datosPorArchivo[archivoSeleccionado?.nombreBackend] || {};
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
    cargarArchivos,
    obtenerDatos,
    datosCombinados,
    setArchivos,
    reset,
    loading,
    error,
  };
};

export default useArchivos;