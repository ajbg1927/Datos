import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://backend-flask-0rnq.onrender.com';

const useArchivos = () => {
  const [archivos, setArchivos] = useState([]);
  const [archivoSeleccionado, setArchivoSeleccionado] = useState('');
  const [hojas, setHojas] = useState([]);
  const [hojaSeleccionada, setHojaSeleccionada] = useState('');
  const [datos, setDatos] = useState([]);
  const [columnas, setColumnas] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/archivos`)
      .then(res => setArchivos(res.data.archivos))
      .catch(err => console.error('Error al obtener archivos:', err));
  }, []);

  useEffect(() => {
    if (archivoSeleccionado) {
      axios.get(`${API_URL}/hojas/${archivoSeleccionado}`)
        .then(res => setHojas(res.data.hojas))
        .catch(err => {
          console.error('Error al obtener hojas:', err);
          setHojas([]);
        });
    } else {
      setHojas([]);
    }
  }, [archivoSeleccionado]);

  useEffect(() => {
    if (archivoSeleccionado && hojaSeleccionada) {
      console.log('Obteniendo datos de:', archivoSeleccionado, hojaSeleccionada);

      axios.get(`${API_URL}/datos/${archivoSeleccionado}/${hojaSeleccionada}`)
        .then(res => {
          const datosRecibidos = res.data.datos || [];
          setDatos(datosRecibidos);
          if (datosRecibidos.length > 0) {
            setColumnas(Object.keys(datosRecibidos[0]));
          } else {
            setColumnas([]);
          }
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
  }, [archivoSeleccionado, hojaSeleccionada]);

  return {
    archivos,
    setArchivos,
    archivoSeleccionado,
    setArchivoSeleccionado,
    hojas,
    hojaSeleccionada,
    setHojaSeleccionada,
    datos,
    columnas
  };
};

export default useArchivos;
