import { useState } from 'react';
import axios from 'axios';

const useArchivos = () => {
  const [archivos, setArchivos] = useState([]);
  const [datosPorArchivo, setDatosPorArchivo] = useState({});
  const [nombresHojasPorArchivo, setNombresHojasPorArchivo] = useState({});

  const subirArchivo = async (archivo) => {
    const formData = new FormData();
    formData.append('file', archivo);

    try {
      const response = await axios.post('https://backend-flask-0rnq.onrender.com/upload', formData);
      const nombreArchivo = archivo.name;
      setArchivos((prev) => [...prev, nombreArchivo]);
      setDatosPorArchivo((prev) => ({ ...prev, [nombreArchivo]: response.data.datos }));
      setNombresHojasPorArchivo((prev) => ({ ...prev, [nombreArchivo]: response.data.hojas }));
    } catch (error) {
      console.error('Error al subir el archivo:', error);
    }
  };

  return {
    archivos,
    datosPorArchivo,
    nombresHojasPorArchivo,
    subirArchivo,
  };
};

export default useArchivos;
