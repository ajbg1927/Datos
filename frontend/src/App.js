import React, { useEffect, useState, useCallback } from 'react';
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
    const [informeData, setInformeData] = useState(null);
    const [resultadosProcesadosPorHoja, setResultadosProcesadosPorHoja] = useState(null);
    const [ticProcesado, setTicProcesado] = useState(false);
    const [datosCombinadosApp, setDatosCombinadosApp] = useState([]);
    const [ejecucionData, setEjecucionData] = useState(null);
    const [corAbiertosData, setCorAbiertosData] = useState(null);
    const [ppAbiertosData, setPpAbiertosData] = useState(null);
    const [ticData, setTicData] = useState([]);
    const [cargandoDatosTabla, setCargandoDatosTabla] = useState(false);
    const [cargandoProcesamiento, setCargandoProcesamiento] = useState(false);

useEffect(() => {
  console.log('--- CONTROL DE FLUJO DE DATOS ---');
  console.log('Archivo seleccionado:', archivoSeleccionado);
  console.log('Hojas seleccionadas:', hojasSeleccionadas);
  console.log('Datos Por Archivo:', datosPorArchivo);
  console.log('Datos Combinados App:', datosCombinadosApp);
  console.log('---------------------------------');
}, [archivoSeleccionado, hojasSeleccionadas, datosPorArchivo, datosCombinadosApp]);

    const ticKeywords = [
        "FUNCIONAMIENTO", "INVERSION", "CUENTAS POR PAGAR", "CDP",
        "VALOR CDP", "DIAS ABIERTOS", "RP", "VALOR INICIAL",
        "PAGOS", "DIAS", "% GASTO"
    ];

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
                    if (data) {
                        console.log("Datos recibidos de la API:", data);
                        setDatosCombinadosApp(data);
                    }
                })
                .catch((error) => {
                    console.error("Error al obtener los datos:", error);
                });
        }
    }, [archivoSeleccionado, hojasSeleccionadas, obtenerDatos]);

    useEffect(() => {
        if (archivoSeleccionado?.nombreBackend && hojasSeleccionadas.length > 0) {
            console.log('Cargando datos desde App.js useEffect...');
            setCargandoDatosTabla(true);
            obtenerDatos(archivoSeleccionado.nombreBackend, hojasSeleccionadas)
                .finally(() => setCargandoDatosTabla(false));
        }
    }, [archivoSeleccionado, hojasSeleccionadas, obtenerDatos]);

    useEffect(() => {
        if (archivoSeleccionado && !hojasPorArchivo[archivoSeleccionado.nombreBackend]) {
            obtenerHojas(archivoSeleccionado.nombreBackend);
        }
    }, [archivoSeleccionado, obtenerHojas, hojasPorArchivo]);

    useEffect(() => {
        if (resultadosProcesadosPorHoja) {
            console.log("Resultados Procesados por Hoja:", resultadosProcesadosPorHoja);
        }
    }, [resultadosProcesadosPorHoja]);


    useEffect(() => {
        console.log('Archivo Seleccionado en useEffect:', archivoSeleccionado);
        console.log('Hojas Seleccionadas en useEffect:', hojasSeleccionadas);
        console.log('Datos Por Archivo en useEffect:', datosPorArchivo);
        if (archivoSeleccionado?.nombreBackend && hojasSeleccionadas.length > 0 && datosPorArchivo[archivoSeleccionado.nombreBackend]?.combinado) {
            console.log('Actualizando datosCombinadosApp con:', datosPorArchivo[archivoSeleccionado.nombreBackend].combinado);
            setDatosCombinadosApp(datosPorArchivo[archivoSeleccionado.nombreBackend].combinado);
        } else {
            console.log('Estableciendo datosCombinadosApp a vacío');
            setDatosCombinadosApp([]);
        }
    }, [archivoSeleccionado, hojasSeleccionadas, datosPorArchivo]);

    const columnasSet = new Set();
    datosCombinadosApp.forEach(row => Object.keys(row).forEach(col => columnasSet.add(col)));
    const columnas = Array.from(columnasSet);
    const columnasFecha = columnas.filter(col => col.toLowerCase().includes('fecha'));
    const columnasNumericas = columnas.filter(col =>
        col.toLowerCase().match(/pago|valor|deducci|oblig|monto|total|suma|saldo/));

    useEffect(() => {
        if (columnas.length > 0 && !columnaAgrupar) setColumnaAgrupar(columnas[0]);
        if (columnasNumericas.length > 0 && !columnaValor) setColumnaValor(columnasNumericas[0]);
    }, [columnas, columnasNumericas, columnaAgrupar, columnaValor]);

    const valoresUnicos = {};
    columnas.forEach(col => {
        const valores = datosCombinadosApp.map(row => row[col]).filter(v => v !== undefined && v !== null);
        valoresUnicos[col] = [...new Set(valores)];
    });

    const texto = filtros.busqueda || '';
    const fechaInicio = filtros.Fecha_desde || '';
    const fechaFin = filtros.Fecha_hasta || '';
    const filtrosColumnas = Object.fromEntries(
        Object.entries(filtros).filter(([key]) => !['busqueda', 'Fecha_desde', 'Fecha_hasta'].includes(key))
    );
    const pagosMin = filtros[`${columnaValor}_min`] || '';
    const pagosMax = filtros[`${columnaValor}_max`] || '';

    const datosFiltrados = useFiltrosAvanzado(
        datosCombinadosApp,
        texto,
        fechaInicio,
        fechaFin,
        filtrosColumnas,
        pagosMin,
        pagosMax,
        columnaValor
    );

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
                const response = await axios.post(`${API_URL}/procesar_excel`, formData, {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                });
                console.log("Respuesta del backend:", response.data);
                setResultadosProcesadosPorHoja(response.data.tablas_por_hoja); 
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
                                <Typography variant="h6" gutterBottom>
                                    Filtros Rápidos
                                </Typography>
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
                                setValorBusqueda={(valor) =>
                                    setFiltros((prev) => ({ ...prev, busqueda: valor }))
                                }
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
                    <Tabs value={tabValue} onChange={handleChangeTab} aria-label="tabs example">
                        <Tab label="Resumen TIC" id="tab-0" aria-controls="tabpanel-0" />
                        <Tab label="Ejecución Detallada" id="tab-1" aria-controls="tabpanel-1" />
                        <Tab label="CDP's Abiertos" id="tab-2" aria-controls="tabpanel-2" />
                        <Tab label="PP Abiertos" id="tab-3" aria-controls="tabpanel-3" />
                        <Tab label="Dirección de las Tics" id="tab-4" aria-controls="tabpanel-4" />
                        <Tab label="Análisis General" id="tab-5" aria-controls="tabpanel-5" />
                    </Tabs>
                    <Box sx={{ p: 3 }}>
                        {tabValue === 4 && (
                            <Box display="flex" flexDirection="column" gap={3}>
                                <Typography variant="h6" gutterBottom>Dirección de las Tics</Typography>
                                {cargandoProcesamiento && (
                                    <Box display="flex" justifyContent="center">
                                        <CircularProgress />
                                    </Box>
                                )}
                                {Object.entries(resultadosProcesadosPorHoja).map(([nombreHoja, tablas]) => (
                                    <div key={nombreHoja} sx={{ mb: 3 }}>
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
                                            <Typography color="error">{tablas?.error || 'No se encontraron tablas para la Dirección de las Tics en esta hoja.'}</Typography>
                                        )}
                                    </div>
                                ))}
                            </Box>
                        )}
                        {tabValue === 5 && (
                            <Box display="flex" flexDirection="column" gap={3}>
                                <Paper elevation={2} sx={{ p: 3 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Datos
                                    </Typography>
                                    {cargandoDatosHook ? (
                                        <Box display="flex" justifyContent="center">
                                            <CircularProgress />
                                        </Box>
                                    ) : (
                                        <>
                                            <Typography variant="subtitle1">Datos Combinados App:</Typography>
                                            <pre>{JSON.stringify(datosCombinadosApp, null, 2)}</pre>
                                            <Typography variant="subtitle1">Columnas:</Typography>
                                            <pre>{JSON.stringify(columnas, null, 2)}</pre>
                                            {datosCombinadosApp && datosCombinadosApp.length > 0 ? (
                                                <TablaDatos datos={datosCombinadosApp} columnas={columnas} />
                                            ) : (
                                                <p>No hay datos disponibles para mostrar.</p>
                                            )}
                                        </>
                                    )}
                                </Paper>

                                <Paper elevation={2} sx={{ p: 3 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Análisis
                                    </Typography>
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
                                    <ExportButtons
                                        datos={datosFiltrados}
                                        columnas={columnas || []}
                                        onExport={handleExportar}
                                    />
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