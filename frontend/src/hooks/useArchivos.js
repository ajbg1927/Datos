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
        for (const archivo of archivosInput) {
            formData.append('archivos', archivo);
        }

        try {
            setLoading(true);
            console.log('Llamando a la API para cargar archivos...');
            const respuesta = await axios.post(`${API_URL}/subir`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            console.log('Respuesta de /subir:', respuesta.data); 

            const archivosBackend = respuesta.data.archivos || [];
            const nuevosArchivos = archivosInput.map((archivo, index) => ({
                nombreOriginal: archivo.name,
                nombreBackend: archivosBackend[index],
                archivo: archivo,
                hojas: [], 
            }));

            setArchivos((prev) => [...prev, ...nuevosArchivos]);

            if (nuevosArchivos.length > 0) {
                setArchivoSeleccionado(nuevosArchivos[0]);
                setHojasSeleccionadas([]); 
                obtenerHojas(nuevosArchivos[0].nombreBackend);
            }

        } catch (err) {
            console.error('Error al cargar archivos:', err);
            const errorMessage = err.response?.data?.error || 'Error inesperado';
            alert(`Error al cargar archivos: ${errorMessage}`);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const obtenerHojas = async (nombreBackend) => {
        if (!nombreBackend) return;

        try {
            const response = await axios.get(`${API_URL}/hojas/${nombreBackend}`);
            setHojasPorArchivo((prev) => ({
                ...prev,
                [nombreBackend]: response.data.hojas || [],
            }));
        } catch (error) {
            console.error('Error al obtener las hojas:', error);
            alert(`Error al obtener las hojas para ${nombreBackend}`);
        }
    };

    const obtenerDatos = async (nombreBackend, hojas) => {
        if (!nombreBackend || !Array.isArray(hojas) || hojas.length === 0) {
            alert('Por favor selecciona al menos una hoja.');
            return;
        }

        try {
            setLoading(true);
            console.log('Llamando a la API para obtener datos...');
            const response = await axios.post(
                `${API_URL}/archivos/datos`,
                { filename: nombreBackend, hojas },
                { headers: { 'Content-Type': 'application/json' } }
            );

            const datos = response.data.datos || [];
            if (!datos || datos.length === 0) {
                alert('No se encontraron datos para la hoja seleccionada.');
                return;
            }

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

    const procesarExcel = async ({ nombreBackend, hoja = 'Hoja1', dependencia = '' }) => {
        if (!nombreBackend) {
            console.error('Error: nombreBackend no proporcionado para procesarExcel');
            setError('Error al procesar el archivo');
            return null;
        }

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('nombreBackend', nombreBackend);
            formData.append('hoja', hoja);
            if (dependencia) formData.append('dependencia', dependencia);

            const response = await axios.post(`${API_URL}/procesar_excel`, formData, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            });

            const { tablas } = response.data;
            setDatosPorArchivo((prev) => ({
                ...prev,
                [nombreBackend]: tablas,
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
        obtenerHojas, 
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