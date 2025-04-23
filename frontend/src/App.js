import React, { useEffect, useState, useCallback } from 'react';
import {
    Box,
    CircularProgress,
    Paper,
    Tab,
    Tabs,
    Typography,
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
        setArchivoSeleccionado,
        hojasSeleccionadas,
        setHojasSeleccionadas,
        hojasPorArchivo,
        datosPorArchivo,
        columnasPorArchivo,
        obtenerDatos,
        datosCombinados,
        cargarArchivos,
        obtenerHojas,
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
    const [ejecucionData, setEjecucionData] = useState(null);
    const [corAbiertosData, setCorAbiertosData] = useState(null);
    const [ppAbiertosData, setPpAbiertosData] = useState(null);
    const [ticData, setTicData] = useState([]);
    const [resultadosProcesados, setResultadosProcesados] = useState(null);
    const [ticProcesado, setTicProcesado] = useState(false);

    const ticKeywords = [
        "FUNCIONAMIENTO", "INVERSION", "CUENTAS POR PAGAR", "CDP",
        "VALOR CDP", "DIAS ABIERTOS", "RP", "VALOR INICIAL",
        "PAGOS", "DIAS", "% GASTO"
    ];

    useEffect(() => {
        if (
            archivoSeleccionado?.nombreBackend &&
            hojasSeleccionadas.length > 0 &&
            !datosPorArchivo[archivoSeleccionado.nombreBackend]?.combinado
        ) {
            console.log('Cargando datos desde App.js useEffect...');
            obtenerDatos(archivoSeleccionado.nombreBackend, hojasSeleccionadas);
        }
    }, [archivoSeleccionado, hojasSeleccionadas, datosPorArchivo, obtenerDatos]);

    useEffect(() => {
        if (archivoSeleccionado && !hojasPorArchivo[archivoSeleccionado.nombreBackend]) {
            obtenerHojas(archivoSeleccionado.nombreBackend);
        }
    }, [archivoSeleccionado, obtenerHojas, hojasPorArchivo]);

    useEffect(() => {
        if (archivoSeleccionado && hojasPorArchivo[archivoSeleccionado.nombreBackend]) {
            const hojas = hojasPorArchivo[archivoSeleccionado.nombreBackend];
            if (hojas.length > 0 && hojasSeleccionadas.length === 0) {
                setHojasSeleccionadas([hojas[0]]);
            }
        }
    }, [archivoSeleccionado, hojasPorArchivo, hojasSeleccionadas, setHojasSeleccionadas]);

    useEffect(() => {
        if (resultadosProcesados) {
            const informe = resultadosProcesados.find(tabla => tabla.nombre?.toLowerCase() === 'informe');
            setInformeData(informe?.data?.[0] || null);

            const ejecucion = resultadosProcesados.find(tabla => tabla.nombre?.toLowerCase() === 'ejecucion');
            setEjecucionData(ejecucion);

            const corAbiertos = resultadosProcesados.find(tabla => tabla.nombre?.toLowerCase() === 'cor abiertos');
            setCorAbiertosData(corAbiertos);

            const ppAbiertos = resultadosProcesados.find(tabla => tabla.nombre?.toLowerCase() === 'pp abiertos');
            setPpAbiertosData(ppAbiertos);

            const ticTables = resultadosProcesados.filter(tabla => {
                const headers = tabla.data?.[0] ? Object.keys(tabla.data[0]) : [];
                const matches = headers.filter(header => ticKeywords.includes(header.toUpperCase()));
                return matches.length >= 3;
            });
            setTicData(ticTables);
            setTicProcesado(true);
        }
    }, [resultadosProcesados, ticKeywords]);

    const datos = datosCombinados();
    console.log('datosCombinados:', datos.length, datos);

    const columnasSet = new Set();
    datos.forEach(row => Object.keys(row).forEach(col => columnasSet.add(col)));
    const columnas = Array.from(columnasSet);

    const columnasFecha = columnas.filter(col => col.toLowerCase().includes('fecha'));
    const columnasNumericas = columnas.filter(col =>
        col.toLowerCase().match(/pago|valor|deducci|oblig|monto|total|suma|saldo/)
    );

    useEffect(() => {
        if (columnas.length > 0 && !columnaAgrupar) setColumnaAgrupar(columnas[0]);
        if (columnasNumericas.length > 0 && !columnaValor) setColumnaValor(columnasNumericas[0]);
    }, [columnas, columnasNumericas, columnaAgrupar, columnaValor]);

    const valoresUnicos = {};
    columnas.forEach(col => {
        const valores = datos.map(row => row[col]).filter(v => v !== undefined && v !== null);
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
        datos,
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

    const handleArchivosSubidos = async (files) => {
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
    };

    const handleProcesarTIC = async () => {
        if (archivoSeleccionado && hojasSeleccionadas.length > 0) {
            const formData = new FormData();
            formData.append('nombreBackend', archivoSeleccionado.nombreBackend);
            formData.append('hoja', hojasSeleccionadas[0]);
            formData.append('dependencia', 'DIRECCION DE LAS TIC');
            try {
                const response = await axios.post(`${API_URL}/procesar_excel`, formData, {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                });
                setResultadosProcesados(response.data.tablas);
            } catch (error) {
                console.error('Error al procesar los datos:', error);
            }
        }
    };

    const handleChangeTab = (event, newValue) => {
        setTabValue(newValue);
        if (newValue === 0 && archivoSeleccionado && hojasSeleccionadas.length > 0 && !ticProcesado) {
            handleProcesarTIC();
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
                <Box display="flex" justifyContent="center" alignItems="center" my={2}>
                    <CircularProgress sx={{ mr: 2 }} />
                    <Typography>Subiendo archivo(s)... por favor espera</Typography>
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
                        onArchivoChange={setArchivoSeleccionado}
                    />
                    <SelectorHojas
                        hojas={hojasPorArchivo[archivoSeleccionado?.nombreBackend] || []}
                        hojasSeleccionadas={hojasSeleccionadas}
                        setHojasSeleccionadas={setHojasSeleccionadas}
                    />
                </Paper>
            )}

            {resultadosProcesados && resultadosProcesados.length > 0 && (
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
                        {tabValue === 1 && ejecucionData?.data && (
                            <TablaDatos datos={ejecucionData.data} columnas={ejecucionData.headers || Object.keys(ejecucionData.data[0] || {})} />
                        )}
                        {tabValue === 2 && corAbiertosData?.data && (
                            <TablaDatos datos={corAbiertosData.data} columnas={corAbiertosData.headers || Object.keys(corAbiertosData.data[0] || {})} />
                        )}
                        {tabValue === 3 && ppAbiertosData?.data && (
                            <TablaDatos datos={ppAbiertosData.data} columnas={ppAbiertosData.headers || Object.keys(ppAbiertosData.data[0] || {})} />
                        )}
                        {tabValue === 4 && ticData.length > 0 && (
                            <Box display="flex" flexDirection="column" gap={3}>
                                <Typography variant="h6" gutterBottom>Información Relevante para la Dirección de las Tics</Typography>
                                {ticData.map((tabla, index) => (
                                    <Paper elevation={2} sx={{ p: 3 }} key={index}>
                                        <Typography variant="subtitle1" gutterBottom>{tabla.nombre || `Tabla ${index + 1}`}</Typography>
                                        <TablaDatos datos={tabla.data} columnas={tabla.headers || Object.keys(tabla.data[0] || {})} />
                                    </Paper>
                                ))}
                            </Box>
                        )}
                        {tabValue === 5 && datos.length > 0 && (
                            <Box display="flex" flexDirection="column" gap={3}>
                                <Paper elevation={2} sx={{ p: 3 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Datos
                                    </Typography>
                                    <TablaDatos datos={datosFiltrados} columnas={columnas} />
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
                                        resultadosProcesados={resultadosProcesados}
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