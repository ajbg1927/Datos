import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://backend-flask-0rnq.onrender.com';

const useArchivos = () => {
  const [archivos, setArchivos] = useState([]);
  const [archivoSeleccionado, setArchivoSeleccionado] = useState('');
  const [hojas, setHojas] = useState([]);
  const [hojasSeleccionadas, setHojasSeleccionadas] = useState([]);
  const [datos, setDatos] = useState([]);
  const [columnas, setColumnas] = useState([]);
  const [columnasFecha, setColumnasFecha] = useState([]);
  const [columnasNumericas, setColumnasNumericas] = useState([]);
  const [valoresUnicos, setValoresUnicos] = useState({});

  
  useEffect(() => {
    const fetchArchivos = async () => {
      try {
        const res = await axios.get(`${API_URL}/archivos`);
        setArchivos(res.data.archivos);
      } catch (err) {
        console.error('Error al obtener archivos:', err);
      }
    };

    fetchArchivos();
  }, []);

  
  useEffect(() => {
    const fetchHojas = async () => {
      if (!archivoSeleccionado) return;
      try {
        const res = await axios.get(`${API_URL}/hojas/${archivoSeleccionado}`);
        setHojas(res.data.hojas);
      } catch (err) {
        console.error('Error al obtener hojas:', err);
      }
    };

    fetchHojas();
  }, [archivoSeleccionado]);

  // Cargar datos de hojas seleccionadas
  useEffect(() => {
    const fetchDatos = async () => {
      if (!archivoSeleccionado || hojasSeleccionadas.length === 0) return;

      console.log('Enviando a /datos:', {
        archivo: archivoSeleccionado,
        hojas: hojasSeleccionadas,
      });

      try {
        const res = await axios.post(
          `${API_URL}/datos`,
          {
            archivo: archivoSeleccionado,
            hojas: hojasSeleccionadas,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        const datos = res.data.datos || [];
        const columnas = res.data.columnas || [];
        const fechas = res.data.columnas_fecha || [];
        const numeros = res.data.columnas_numericas || [];
        const unicos = res.data.valores_unicos || {};

        setDatos(datos);
        setColumnas(columnas);
        setColumnasFecha(fechas);
        setColumnasNumericas(numeros);
        setValoresUnicos(unicos);
      } catch (err) {
        console.error('Error al obtener datos:', err);
      }
    };

    fetchDatos();
  }, [archivoSeleccionado, hojasSeleccionadas]);

  return {
    archivos,
    setArchivos,
    archivoSeleccionado,
    setArchivoSeleccionado,
    hojas,
    hojasSeleccionadas,
    setHojasSeleccionadas,
    datos,
    columnas,
    columnasFecha,
    columnasNumericas,
    valoresUnicos,
  };
};

export default useArchivos;

