import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
import FiltroDependencia from './components/FiltroDependencia';

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
        cargandoDatos,
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

    const [datosCombinadosApp, setDatosCombinadosApp] = useState([]);
    const [datosFiltrados, setDatosFiltrados] = useState([]);
    const [columnas, setColumnas] = useState([]);
    const [columnasCargadas, setColumnasCargadas] = useState(false);

    const [resultadosProcesadosPorHoja, setResultadosProcesadosPorHoja] = useState(null);
    const [dependenciasPorHoja, setDependenciasPorHoja] = useState({});
    const [ticProcesado, setTicProcesado] = useState(false);
    const [hojaSeleccionada, setHojaSeleccionada] = useState('');
    const [dependenciaSeleccionada, setDependenciaSeleccionada] = useState('');

    const handleArchivoSeleccionadoChange = useCallback((archivo) => {
        setArchivoSeleccionadoFromHook(archivo);
        setHojasSeleccionadasFromHook([]);
        setColumnas([]);
        setColumnasCargadas(false);
        setDatosCombinadosApp([]);
    }, []);

    const handleHojasSeleccionadasChange = useCallback((hojas) => {
        setHojasSeleccionadasFromHook(hojas);
    }, []);

    useEffect(() => {
        const cargarDatos = async () => {
            if (archivoSeleccionado && hojasSeleccionadas.length > 0) {
                const data = await obtenerDatos(archivoSeleccionado.nombreBackend, hojasSeleccionadas);
                if (data) {
                    setDatosCombinadosApp(data);
                    if (data.length > 0 && !columnasCargadas) {
                        setColumnas(Object.keys(data[0]));
                        setColumnasCargadas(true);
                    }
                }
            }
        };
        cargarDatos();
    }, [archivoSeleccionado, hojasSeleccionadas]);

    useEffect(() => {
        if (archivoSeleccionado && !hojasPorArchivo[archivoSeleccionado.nombreBackend]) {
            obtenerHojas(archivoSeleccionado.nombreBackend);
        }
    }, [archivoSeleccionado]);

    const columnasFecha = useMemo(() => columnas.filter(col => col.toLowerCase().includes('fecha')), [columnas]);
    const columnasNumericas = useMemo(() => columnas.filter(col => /pago|valor|deducci|oblig|monto|total|suma|saldo/i.test(col)), [columnas]);

    const valoresUnicos = useMemo(() => {
        const res = {};
        columnas.forEach(col => {
            res[col] = [...new Set(datosCombinadosApp.map(d => d[col]).filter(v => v != null))];
        });
        return res;
    }, [columnas, datosCombinadosApp]);

    useEffect(() => {
        if (!columnaAgrupar && columnas.length > 0) setColumnaAgrupar(columnas[0]);
        if (!columnaValor && columnasNumericas.length > 0) setColumnaValor(columnasNumericas[0]);
    }, [columnas]);

    const filtrosAplicados = useFiltrosAvanzado(
        datosCombinadosApp,
        filtros.busqueda || '',
        filtros.Fecha_desde || '',
        filtros.Fecha_hasta || '',
        Object.fromEntries(Object.entries(filtros).filter(([k]) => !['busqueda', 'Fecha_desde', 'Fecha_hasta'].includes(k))),
        filtros[`${columnaValor}_min`] || '',
        filtros[`${columnaValor}_max`] || '',
        columnaValor
    );

    useEffect(() => {
        setDatosFiltrados(filtrosAplicados);
    }, [filtrosAplicados]);

    const { exportToExcel, exportToCSV, exportToPDF, exportToTXT } = useExportaciones();

    const handleArchivosSubidos = useCallback(async (files) => {
        setIsLoadingUpload(true);
        const formData = new FormData();
        files.forEach(file => formData.append('archivos', file));

        try {
            await axios.post(`${API_URL}/subir`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            await cargarArchivos(files);
        } catch (error) {
            console.error('Error al subir archivos:', error);
            alert('Error al subir archivos');
        } finally {
            setIsLoadingUpload(false);
        }
    }, []);

    const handleProcesarDatos = useCallback(async () => {
        if (archivoSeleccionado && hojasSeleccionadas.length > 0) {
            try {
                const formData = new FormData();
                formData.append('nombreBackend', archivoSeleccionado.nombreBackend);
                formData.append('hojas', JSON.stringify(hojasSeleccionadas));
                formData.append('dependencia', 'DIRECCION DE LAS TIC');

                const res = await axios.post(`${API_URL}/procesar_excel`, formData);
                setResultadosProcesadosPorHoja(res.data.tablas_por_hoja);
                setDependenciasPorHoja(res.data.dependencias_por_hoja || {});
                setTicProcesado(true);
            } catch (error) {
                console.error('Error al procesar los datos:', error);
            }
        }
    }, [archivoSeleccionado, hojasSeleccionadas]);

    const handleTabChange = (e, newValue) => {
        setTabValue(newValue);
        if (newValue === 4 && !ticProcesado) {
            handleProcesarDatos();
        }
    };

    const onSeleccionarDependencia = ({ hoja, dependencia }) => {
        setHojaSeleccionada(hoja);
        setDependenciaSeleccionada(dependencia);

        const datosOriginales = resultadosProcesadosPorHoja?.[hoja] || [];
        const filtrados = datosOriginales.flat().filter(r => r?.Dependencia?.toUpperCase() === dependencia.toUpperCase());

        setDatosFiltrados(filtrados);
        setColumnas(filtrados.length ? Object.keys(filtrados[0]) : []);
    };

    return (
        <Layout
            sidebar={
                <Paper elevation={1} sx={{ p: 3, borderRadius: 3, backgroundColor: 'white' }}>
                    {columnas.length > 0 ? (
                        <>
                            <Filtros
                                data={datosCombinadosApp}
                                columnas={columnas}
                                valoresUnicos={valoresUnicos}
                                filtros={filtros}
                                setFiltros={setFiltros}
                                columnasFecha={columnasFecha}
                                columnasNumericas={columnasNumericas}
                                valorBusqueda={filtros.busqueda || ''}
                                setValorBusqueda={(v) => setFiltros(prev => ({ ...prev, busqueda: v }))}
                                columnaAgrupar={columnaAgrupar}
                                setColumnaAgrupar={setColumnaAgrupar}
                                columnaValor={columnaValor}
                                setColumnaValor={setColumnaValor}
                                esBusquedaGeneral
                            />
                            <Filtros
                                data={datosCombinadosApp}
                                columnas={columnas}
                                valoresUnicos={valoresUnicos}
                                filtros={filtros}
                                setFiltros={setFiltros}
                                columnasFecha={columnasFecha}
                                columnasNumericas={columnasNumericas}
                                valorBusqueda={filtros.busqueda || ''}
                                setValorBusqueda={(v) => setFiltros(prev => ({ ...prev, busqueda: v }))}
                                columnaAgrupar={columnaAgrupar}
                                setColumnaAgrupar={setColumnaAgrupar}
                                columnaValor={columnaValor}
                                setColumnaValor={setColumnaValor}
                                esBusquedaGeneral={false}
                            />
                        </>
                    ) : (
                        <Typography variant="body2">Selecciona un archivo para ver filtros.</Typography>
                    )}
                </Paper>
            }
        >
            {isLoadingUpload && <Box display="flex" justifyContent="center"><CircularProgress /></Box>}

            <UploadFile onFilesUploaded={handleArchivosSubidos} />

            {archivos.length > 0 && (
                <TablaArchivos
                    archivos={archivos}
                    archivoSeleccionado={archivoSeleccionado}
                    onArchivoChange={handleArchivoSeleccionadoChange}
                />
            )}

            {hojasPorArchivo[archivoSeleccionado?.nombreBackend]?.length > 0 && (
                <SelectorHojas
                    hojas={hojasPorArchivo[archivoSeleccionado.nombreBackend]}
                    hojasSeleccionadas={hojasSeleccionadas}
                    setHojasSeleccionadas={handleHojasSeleccionadasChange}
                />
            )}

            {datosFiltrados.length > 0 && (
                <>
                    <TablaDatos datosIniciales={datosFiltrados} columnasDefinidas={columnas} />
                    <ExportButtons datos={datosFiltrados} columnas={columnas} exportadores={{ exportToExcel, exportToCSV, exportToPDF, exportToTXT }} />
                </>
            )}

            {resultadosProcesadosPorHoja && (
                <Paper elevation={2}>
                    <Tabs value={tabValue} onChange={handleTabChange}>
                        <Tab label="Resumen TIC" />
                        <Tab label="Ejecución Detallada" />
                        <Tab label="CDP's Abiertos" />
                        <Tab label="PP Abiertos" />
                        <Tab label="Tablas Procesadas" />
                        <Tab label="Análisis General" />
                    </Tabs>

                    <Box sx={{ p: 3 }}>
                        {tabValue === 4 && (
                            Object.entries(resultadosProcesadosPorHoja).map(([nombreHoja, tablas]) => (
                                <Box key={nombreHoja}>
                                    <Typography variant="subtitle1">Hoja: {nombreHoja}</Typography>
                                    {tablas.map((tabla, idx) => (
                                        <TablaDatos key={idx} datos={tabla} columnasDefinidas={Object.keys(tabla[0] || {})} />
                                    ))}
                                </Box>
                            ))
                        )}

                        {tabValue === 5 && (
                            <>
                                <FiltroDependencia sheets={Object.keys(dependenciasPorHoja)} dependenciasPorHoja={dependenciasPorHoja} onSeleccionar={onSeleccionarDependencia} />

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

                                <ResumenGeneral datos={datosFiltrados} columnaValor={columnaValor} resultadosProcesados={Object.values(resultadosProcesadosPorHoja).flat()} />

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
                            </>
                        )}
                    </Box>
                </Paper>
            )}
        </Layout>
    );
};

export default App;