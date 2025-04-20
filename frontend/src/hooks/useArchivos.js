import { useState } from 'react';
import axios from 'axios';

const API_URL = 'https://backend-flask-0rnq.onrender.com';

const useArchivos = () => {
  const [archivos, setArchivos] = useState([]);
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
  const [hojasSeleccionadas, setHojasSeleccionadas] = useState([]);
  const [hojasPorArchivo, setHojasPorArchivo] = useState({});
  const [datosPorArchivo, setDatosPorArchivo] = useState({});
  const [columnasPorArchivo, setColumnasPorArchivo] = useState({});

  const cargarArchivos = async (archivosInput) => {
    if (!archivosInput || archivosInput.length === 0) {
      alert("No se seleccionaron archivos.");
      return;
    }

    const formData = new FormData();

    for (const archivo of archivosInput) {
      formData.append('archivos', archivo);
    }

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

    } catch (error) {
      console.error('Error al subir o leer hojas de los archivos:', error.response || error);
      alert(`Error en la carga: ${error?.response?.data?.error || 'Error inesperado'}`);
    }
  };

  const obtenerDatos = async (nombreBackend, hojas) => {
    try {
      if (!nombreBackend || !hojas || hojas.length === 0) {
        console.warn('Falta nombre del archivo o lista de hojas');
        alert('Por favor, seleccione un archivo y las hojas correspondientes.');
        return;
      }

      if (!Array.isArray(hojas) || hojas.length === 0) {
        alert('No se especificaron hojas válidas.');
        return;
      }

      const nombreCodificado = encodeURIComponent(nombreBackend);

      console.log('Solicitando datos a backend:', {
        url: `${API_URL}/archivos/datos`,
        filename: nombreBackend,
        hojas
      });

      const response = await axios.post(
        `${API_URL}/archivos/datos`,
        {
          filename: nombreBackend, 
          hojas
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

    } catch (error) {
      console.error('Error al obtener datos del archivo:', error);
      alert(`Error al obtener datos: ${error?.response?.data?.error || 'Error inesperado'}`);
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
    obtenerDatos,
    datosCombinados,
    setArchivos,
    cargarArchivos,
  };
};

export default useArchivos;