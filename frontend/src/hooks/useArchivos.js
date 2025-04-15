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

  useEffect(() => {
    axios.get(`${API_URL}/archivos`)
      .then(res => setArchivos(res.data.archivos))
      .catch(err => console.error('Error al obtener archivos:', err));
  }, []);

  useEffect(() => {
    if (archivoSeleccionado) {
      axios.get(`${API_URL}/hojas/${encodeURIComponent(archivoSeleccionado)}`)
        .then(res => setHojas(res.data.hojas))
        .catch(err => {
          console.error('Error al obtener hojas:', err);
          setHojas([]);
        });
    } else {
      setHojas([]);
      setHojasSeleccionadas([]);
    }
  }, [archivoSeleccionado]);

  useEffect(() => {
    if (archivoSeleccionado && hojasSeleccionadas.length > 0) {
      axios.post(`${API_URL}/datos/${encodeURIComponent(archivoSeleccionado)}`, {
        hojas: hojasSeleccionadas
      })
        .then(res => {
          const datosRecibidos = res.data.datos || [];
          setDatos(datosRecibidos);
          setColumnas(datosRecibidos.length > 0 ? Object.keys(datosRecibidos[0]) : []);
        })
        .catch(err => {
          console.error('Error al obtener datos:', err);
          setDatos([]);
          setColumnas([]);
        });
    } else {
      setDatos([]);
      setColumnas([]);
    }
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
    columnas
  };
};

export default useArchivos;