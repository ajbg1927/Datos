import { useState, useCallback } from 'react';
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
    const [cargandoDatos, setCargandoDatos] = useState(false);

    const obtenerDatos = useCallback(async (nombreBackend, hojas) => {
        if (!nombreBackend || !Array.isArray(hojas) || hojas.length === 0 || cargandoDatos) {
            console.log('obtenerDatos llamado innecesariamente o ya en curso.');
            return [];
        }

        try {
            setCargandoDatos(true);
            console.log('Llamando a obtenerDatos con:', nombreBackend, hojas);
            const response = await axios.post(
                `${API_URL}/archivos/datos`,
                { filename: nombreBackend, hojas },
                { headers: { 'Content-Type': 'application/json' } }
            );

            const datos = response.data.datos || [];
            if (!datos || datos.length === 0) {
                alert('No se encontraron datos para la hoja seleccionada.');
                return [];
            }

            setDatosPorArchivo((prev) => ({
                ...prev,
                [nombreBackend]: {
                    ...prev[nombreBackend],
                    combinado: datos,
                },
            }));

            if (datos.length > 0) {
                const columnasUnicas = Array.from(
                    new Set(datos.flatMap((fila) => Object.keys(fila)))
                    );
                setColumnasPorArchivo((prev) => ({
                    ...prev,
                    [nombreBackend]: columnasUnicas,
                }));
            }
            
            return datos;
        } catch (err) {
            console.error('Error al obtener datos:', err);
            alert(`Error al obtener datos: ${err?.response?.data?.error || 'Error inesperado'}`);
            return [];
        } finally {
            setCargandoDatos(false);
        }
    }, []); 

    const obtenerHojas = useCallback(async (nombreBackend) => {
        if (!nombreBackend) return;

        try {
            const response = await axios.get(`${API_URL}/hojas/${nombreBackend}`);
            const hojas = response.data.hojas || [];
            setHojasPorArchivo((prev) => ({
                ...prev,
                [nombreBackend]: hojas,
            }));

        } catch (error) {
            console.error('Error al obtener las hojas:', error);
            alert(`Error al obtener las hojas para ${nombreBackend}`);
        }
    }, []);

    const cargarArchivos = useCallback(async (archivosInput) => {
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

        const archivosBackend = respuesta.data.archivos || [];
        const nuevosArchivos = [];

        for (let i = 0; i < archivosInput.length; i++) {
            const archivo = archivosInput[i];
            const nombreBackend = archivosBackend[i];

            const responseHojas = await axios.get(`${API_URL}/hojas/${nombreBackend}`);
            const hojas = responseHojas.data.hojas || [];

            nuevosArchivos.push({
                nombreOriginal: archivo.name,
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
            const primerArchivo = nuevosArchivos[0];
            setArchivoSeleccionado(primerArchivo);
            setHojasSeleccionadas([]);
        }

    } catch (err) {
        console.error('Error al cargar archivos:', err);
        const errorMessage = err.response?.data?.error || 'Error inesperado';
        alert(`Error al cargar archivos: ${errorMessage}`);
        setError(errorMessage);
    } finally {
        setLoading(false);
    }
}, []);

    const datosCombinados = useCallback(() => {
        if (!archivoSeleccionado || hojasSeleccionadas.length === 0) return [];
        const datosArchivo = datosPorArchivo[archivoSeleccionado.nombreBackend] || {};
        return datosArchivo.combinado || [];
    }, [archivoSeleccionado, datosPorArchivo, hojasSeleccionadas]);

    const procesarExcel = useCallback(async ({ nombreBackend, hoja = 'Hoja1', dependencia = '' }) => {
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
    }, []);

    const reset = useCallback(() => {
        setArchivos([]);
        setArchivoSeleccionado(null);
        setHojasSeleccionadas([]);
        setHojasPorArchivo({});
        setDatosPorArchivo({});
        setColumnasPorArchivo({});
        setError(null);
        setLoading(false);
        setCargandoDatos(false);
    }, []);

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
        setCargandoDatos,
    };
};

export default useArchivos;