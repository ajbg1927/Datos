import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
    Box, CircularProgress, Paper, Tab, Tabs, Typography,
} from '@mui/material';

import Layout from './components/Layout';
import UploadFile from './components/UploadFile';
import TablaArchivos from './components/TablaArchivos';
import SelectorHojas from './components/SelectorHojas';
import Filtros from './components/Filtros';
import TablaDatos from './components/TablaDatos';
import Graficos from './components/Graficos';
import ExportButtons from './components/ExportButtons';
import ResumenGeneral from './components/ResumenGeneral';
import SelectoresAgrupacion from './components/SelectoresAgrupacion';
import FiltroRapidoTIC from './components/FiltroRapidoTIC';
import FiltroDependencia from './components/FiltroDependencia'; // ¡No olvides este!

import useArchivos from './hooks/useArchivos';
import useFiltrosAvanzado from './hooks/useFiltrosAvanzado';
import useExportaciones from './hooks/useExportaciones';
import axios from 'axios';

const API_URL = 'https://backend-flask-u76y.onrender.com';

const App = () => {
    const {
        archivos,
        setArchivos,
        archivoSeleccionado,
        setArchivoSeleccionado: setArchivoSeleccionadoFromHook,
        hojasSeleccionadas,
        setHojasSeleccionadas: setHojasSeleccionadasFromHook,
        hojasPorArchivo,
        datosPorArchivo,
        columnasPorArchivo,
        obtenerDatos,
        cargarArchivos,
        obtenerHojas,
        cargandoDatos: cargandoDatosHook,
    } = useArchivos();

    const [filtros, setFiltros] = useState({});
    const [columnaAgrupar, setColumnaAgrupar] = useState('');
    const [columnaValor, setColumnaValor] = useState('');
    const [isLoadingUpload, setIsLoadingUpload] = useState(false);
    const [tipoGrafico, setTipoGrafico] = useState('Barras');
    const [paleta, setPaleta] = useState('Institucional');
    const [ordenarGrafico, setOrdenarGrafico] = useState(true);
    const [topNGrafico, setTopNGrafico] = useState(10);
    const [mostrarPorcentajeBarras, setMostrarPorcentajeBarras] = useState(false);
    const [tabValue, setTabValue] = useState(0);
    const [resultadosProcesadosPorHoja, setResultadosProcesadosPorHoja] = useState(null);
    const [ticProcesado, setTicProcesado] = useState(false);
    const [datosCombinadosApp, setDatosCombinadosApp] = useState([]);
    const [cargandoProcesamiento, setCargandoProcesamiento] = useState(false);

    const [datosFiltrados, setDatosFiltrados] = useState([]);
    const [dependenciasPorHoja, setDependenciasPorHoja] = useState({});
    const [hojaSeleccionada, setHojaSeleccionada] = useState('');
    const [dependenciaSeleccionada, setDependenciaSeleccionada] = useState('');
    const [columnas, setColumnas] = useState([]);

    const handleArchivoSeleccionadoChange = useCallback((archivo) => {
        setArchivoSeleccionadoFromHook(archivo);
        setHojasSeleccionadasFromHook([]);
    }, [setArchivoSeleccionadoFromHook, setHojasSeleccionadasFromHook]);

    const handleHojasSeleccionadasChange = useCallback((hojas) => {
        setHojasSeleccionadasFromHook(hojas);
    }, [setHojasSeleccionadasFromHook]);

    useEffect(() => {
        if (archivoSeleccionado && hojasSeleccionadas.length > 0) {
            obtenerDatos(archivoSeleccionado.nombreBackend, hojasSeleccionadas)
                .then((data) => {
                    if (data) setDatosCombinadosApp(data);
                })
                .catch(console.error);
        }
    }, [archivoSeleccionado, hojasSeleccionadas, obtenerDatos]);

    useEffect(() => {
        if (archivoSeleccionado && !hojasPorArchivo[archivoSeleccionado.nombreBackend]) {
            obtenerHojas(archivoSeleccionado.nombreBackend);
        }
    }, [archivoSeleccionado, obtenerHojas, hojasPorArchivo]);

    const columnasFecha = useMemo(() => columnas.filter(col => col.toLowerCase().includes('fecha')), [columnas]);

    const columnasNumericas = useMemo(() => columnas.filter(col =>
        col.toLowerCase().match(/pago|valor|deducci|oblig|monto|total|suma|saldo/)), [columnas]);

    const valoresUnicos = useMemo(() => {
        const result = {};
        columnas.forEach(col => {
            const valores = datosCombinadosApp.map(row => row[col]).filter(v => v !== undefined && v !== null);
            result[col] = [...new Set(valores)];
        });
        return result;
    }, [columnas, datosCombinadosApp]);

    useEffect(() => {
        if (!columnaAgrupar && columnas.length > 0) setColumnaAgrupar(columnas[0]);
        if (!columnaValor && columnasNumericas.length > 0) setColumnaValor(columnasNumericas[0]);
    }, [columnas, columnasNumericas, columnaAgrupar, columnaValor]);

    const texto = filtros.busqueda || '';
    const fechaInicio = filtros.Fecha_desde || '';
    const fechaFin = filtros.Fecha_hasta || '';
    const filtrosColumnas = Object.fromEntries(
        Object.entries(filtros).filter(([key]) => !['busqueda', 'Fecha_desde', 'Fecha_hasta'].includes(key))
    );
    const pagosMin = filtros[`${columnaValor}_min`] || '';
    const pagosMax = filtros[`${columnaValor}_max`] || '';

    const datosFiltradosHook = useFiltrosAvanzado(
        datosCombinadosApp,
        texto,
        fechaInicio,
        fechaFin,
        filtrosColumnas,
        pagosMin,
        pagosMax,
        columnaValor
    );

    useEffect(() => setDatosFiltrados(datosFiltradosHook), [datosFiltradosHook]);

    const { exportToExcel, exportToCSV, exportToPDF, exportToTXT } = useExportaciones();

    const handleClearFilters = () => setFiltros({});

    const handleExportar = (formato) => {
        const exportadores = {
            excel: exportToExcel,
            csv: exportToCSV,
            pdf: exportToPDF,
            txt: exportToTXT,
        };
        (exportadores[formato] || exportToExcel)(datosFiltrados, columnas);
    };

    const handleArchivosSubidos = useCallback(async (files) => {
        const formData = new FormData();
        files.forEach(file => formData.append('archivos', file));
        try {
            setIsLoadingUpload(true);
            await axios.post(`${API_URL}/subir`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            await cargarArchivos(files);
        } catch (error) {
            console.error('Error al subir archivos:', error);
            alert('Error al subir archivos');
        } finally {
            setIsLoadingUpload(false);
        }
    }, [cargarArchivos]);

    const handleProcesarDatos = useCallback(async () => {
        if (archivoSeleccionado && hojasSeleccionadas.length > 0) {
            setCargandoProcesamiento(true);
            const formData = new FormData();
            formData.append('nombreBackend', archivoSeleccionado.nombreBackend);
            formData.append('hojas', JSON.stringify(hojasSeleccionadas));
            formData.append('dependencia', 'DIRECCION DE LAS TIC');

            try {
                const response = await axios.post(`${API_URL}/procesar_excel`, formData);
                setResultadosProcesadosPorHoja(response.data.tablas_por_hoja);
                setDependenciasPorHoja(response.data.dependencias_por_hoja || {});
            } catch (error) {
                console.error('Error al procesar los datos:', error);
            } finally {
                setCargandoProcesamiento(false);
            }
        } else {
            alert('Por favor, selecciona un archivo y al menos una hoja.');
        }
    }, [archivoSeleccionado, hojasSeleccionadas]);

    const handleChangeTab = (event, newValue) => {
        setTabValue(newValue);
        if (newValue === 4 && archivoSeleccionado && hojasSeleccionadas.length > 0 && !ticProcesado) {
            handleProcesarDatos();
            setTicProcesado(true);
        }
    };

    return (
    <Layout
        sidebar={
            <Paper elevation={1} sx={{ p: 3, borderRadius: 3, backgroundColor: 'white' }}>
                {columnas.length > 0 ? (
                    <>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="h6" gutterBottom>Filtros Rápidos</Typography>
                            <FiltroRapidoTIC
                                columns={columnas}
                                setFiltrosActivos={setFiltros}
                                filtrosActivos={filtros}
                                data={datosFiltrados}
                            />
                        </Box>
                        <Filtros
                            columnas={columnas}
                            valoresUnicos={valoresUnicos}
                            filtros={filtros}
                            setFiltros={setFiltros}
                            handleClearFilters={handleClearFilters}
                            columnasFecha={columnasFecha}
                            columnasNumericas={columnasNumericas}
                            valorBusqueda={filtros.busqueda || ''}
                            setValorBusqueda={(valor) => setFiltros((prev) => ({ ...prev, busqueda: valor }))}
                            columnaAgrupar={columnaAgrupar}
                            setColumnaAgrupar={setColumnaAgrupar}
                            columnaValor={columnaValor}
                            setColumnaValor={setColumnaValor}
                        />
                    </>
                ) : (
                    <Typography variant="body2" color="textSecondary">
                        Selecciona un archivo para ver los filtros.
                    </Typography>
                )}
            </Paper>
        }
    >
        {isLoadingUpload && (
            <Box display="flex" justifyContent="center" alignItems="center" my={4}>
                <CircularProgress />
            </Box>
        )}

        <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
            <UploadFile onFilesUploaded={handleArchivosSubidos} />
        </Paper>

        {archivos?.length > 0 && (
            <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom>Archivos Cargados</Typography>
                <TablaArchivos
                    archivos={archivos}
                    archivoSeleccionado={archivoSeleccionado}
                    onArchivoChange={handleArchivoSeleccionadoChange}
                />
                <SelectorHojas
                    hojas={hojasPorArchivo[archivoSeleccionado?.nombreBackend] || []}
                    hojasSeleccionadas={hojasSeleccionadas}
                    setHojasSeleccionadas={handleHojasSeleccionadasChange}
                />
            </Paper>
        )}

        {resultadosProcesadosPorHoja && (
            <Paper elevation={2} sx={{ width: '100%' }}>
                <Tabs value={tabValue} onChange={handleChangeTab}>
                    <Tab label="Resumen TIC" />
                    <Tab label="Ejecución Detallada" />
                    <Tab label="CDP's Abiertos" />
                    <Tab label="PP Abiertos" />
                    <Tab label="Tablas Procesadas" />
                    <Tab label="Análisis General" />
                </Tabs>

                <Box sx={{ p: 3 }}>
                    {tabValue === 4 && (
                        <Box display="flex" flexDirection="column" gap={3}>
                            <Typography variant="h6" gutterBottom>Tablas Procesadas</Typography>
                            {cargandoProcesamiento ? (
                                <Box display="flex" justifyContent="center"><CircularProgress /></Box>
                            ) : (
                                Object.entries(resultadosProcesadosPorHoja).map(([nombreHoja, tablas]) => (
                                    <Box key={nombreHoja} mb={3}>
                                        <Typography variant="subtitle1">Hoja: {nombreHoja}</Typography>
                                        {Array.isArray(tablas) && tablas.length > 0 ? (
                                            tablas.map((tabla, index) => (
                                                <Paper key={`${nombreHoja}-${index}`} elevation={1} sx={{ mt: 1, p: 2 }}>
                                                    <Typography variant="body2" fontWeight="bold">Tabla {index + 1}</Typography>
                                                    {tabla.length > 0 ? (
                                                        <TablaDatos datos={tabla} columnas={Object.keys(tabla[0] || {})} />
                                                    ) : (
                                                        <Typography>No hay datos en esta tabla.</Typography>
                                                    )}
                                                </Paper>
                                            ))
                                        ) : (
                                            <Typography color="error">
                                                {typeof tablas === 'object' && tablas?.error
                                                    ? tablas.error
                                                    : 'No se encontraron tablas en esta hoja.'}
                                            </Typography>
                                        )}
                                    </Box>
                                ))
                            )}
                        </Box>
                    )}

                    {tabValue === 5 && (
                        <Box display="flex" flexDirection="column" gap={3}>
                            <FiltroDependencia
                                sheets={Object.keys(dependenciasPorHoja || {})}
                                dependenciasPorHoja={dependenciasPorHoja}
                                onSeleccionar={({ hoja, dependencia }) => {
                                    console.log("Seleccionado hoja:", hoja, "dependencia:", dependencia);
                                    setHojaSeleccionada(hoja);
                                    setDependenciaSeleccionada(dependencia);
                                    const datosOriginales = resultadosProcesadosPorHoja?.[hoja] || [];
                                    console.log("Originales:", datosOriginales);
                                    const datosFiltrados = datosOriginales
                                        .flat()
                                        .filter((row) => row?.Dependencia?.toUpperCase?.() === dependencia.toUpperCase());
                                    console.log("Filtrados:", datosFiltrados);
                                    setDatosFiltrados(datosFiltrados);
                                    setColumnas(Object.keys(datosFiltrados[0] || {}));
                                }}
                            />

                            <Paper elevation={2} sx={{ p: 3 }}>
                                <Typography variant="h6" gutterBottom>Datos</Typography>
                                {cargandoDatosHook ? (
                                    <Box display="flex" justifyContent="center"><CircularProgress /></Box>
                                ) : (
                                    <TablaDatos datos={datosFiltrados} columnas={columnas} />
                                )}
                            </Paper>

                            <Paper elevation={2} sx={{ p: 3 }}>
                                <Typography variant="h6" gutterBottom>Análisis</Typography>
                                <SelectoresAgrupacion
                                    columnas={columnas}
                                    columnaAgrupar={columnaAgrupar}
                                    setColumnaAgrupar={setColumnaAgrupar}
                                    columnaValor={columnaValor}
                                    setColumnaValor={setColumnaValor}
                                    tipoGrafico={tipoGrafico}
                                    setTipoGrafico={setTipoGrafico}
                                    paleta={paleta}
                                    setPaleta={setPaleta}
                                    ordenar={ordenarGrafico}
                                    setOrdenar={setOrdenarGrafico}
                                    topN={topNGrafico}
                                    setTopN={setTopNGrafico}
                                    mostrarPorcentajeBarras={mostrarPorcentajeBarras}
                                    setMostrarPorcentajeBarras={setMostrarPorcentajeBarras}
                                />
                                <ResumenGeneral
                                    datos={datosFiltrados}
                                    columnaValor={columnaValor}
                                    resultadosProcesados={resultadosProcesadosPorHoja ? Object.values(resultadosProcesadosPorHoja).flat() : []}
                                />
                                <Graficos
                                    datos={datosFiltrados}
                                    columnaAgrupacion={columnaAgrupar}
                                    columnaValor={columnaValor}
                                    tipoGrafico={tipoGrafico}
                                    paleta={paleta}
                                    ordenar={ordenarGrafico}
                                    topN={topNGrafico}
                                    mostrarPorcentajeBarras={mostrarPorcentajeBarras}
                                />
                            </Paper>

                            <Paper elevation={2} sx={{ p: 2 }}>
                                <ExportButtons datos={datosFiltrados} columnas={columnas || []} onExport={handleExportar} />
                            </Paper>
                        </Box>
                    )}
                </Box>
            </Paper>
        )}
    </Layout>
);

};

export default App;