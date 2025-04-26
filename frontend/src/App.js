import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
    Box, CircularProgress, Paper, Tab, Tabs, Typography, TextField, Divider,  MenuItem
} from '@mui/material';
import { Toaster, toast } from 'react-hot-toast';

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
import useGraficos from './hooks/useGraficos';
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
        datosPorArchivo: datosPorArchivoHook,
        columnasPorArchivo: columnasPorArchivoHook,
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
    const [columnasEstablecidas, setColumnasEstablecidas] = useState(false);

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
                        setDatosCombinadosApp(data);
                        toast.success(`Datos cargados: ${data.length} registros`);
                        if (data.length > 0) {
                            setColumnas(Object.keys(data[0]));
                            setColumnasEstablecidas(true);
                        }
                    }
                })
                .catch(console.error);
        } else {
            setColumnasEstablecidas(false);
            setDatosCombinadosApp([]);
            setColumnas([]);
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
    const filtrosMemoizado = useMemo(() => filtros, [filtros]);
    const filtrosColumnas = Object.fromEntries(
        Object.entries(filtrosMemoizado).filter(([key]) => !['busqueda', 'Fecha_desde', 'Fecha_hasta'].includes(key))
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

    const onSeleccionar = (dependencia, datosFiltrados) => {
        setDatosFiltrados(datosFiltrados);
        setDependenciaSeleccionada(dependencia);

        if (datosFiltrados.length > 0) {
            setColumnas(Object.keys(datosFiltrados[0]));
        } else {
            setColumnas([]);
        }
    };

    return (
        <>
        <Toaster position="bottom-right" />
        <Layout
        sidebar={
            <Paper elevation={1} sx={{ p: 3, borderRadius: 3, backgroundColor: 'white' }}>
            {columnas.length > 0 ? (
                <>
                {[
                    { tipo: 'busqueda' },
                    { tipo: 'selectores' }, 
                    { tipo: 'filtrosAvanzados' }
                ].map((config, index) => (
                    <Box key={index} sx={{ mb: 4 }}>
                    {config.tipo === 'busqueda' ? (
                        <>
                        <Typography variant="h6" gutterBottom>Buscar en todo el archivo</Typography>
                        <TextField
                        fullWidth
                        size="small"
                        variant="outlined"
                        placeholder="Buscar..."
                        value={filtros.busqueda || ''}
                        onChange={(e) => setFiltros((prev) => ({ ...prev, busqueda: e.target.value }))}
                        />
                        </>
                        ) : config.tipo === 'selectores' ? ( 
                        <>
                        <Typography variant="h6" gutterBottom>Configuración de columnas</Typography>

                        <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>Columna para Agrupar</Typography>
                        <TextField
                        fullWidth
                        size="small"
                        select
                        value={columnaAgrupar || ''}
                        onChange={(e) => setColumnaAgrupar(e.target.value)}
                        >
                        {columnas.map((columna) => (
                            <MenuItem key={columna} value={columna}>
                            {columna}
                            </MenuItem>
                        ))}
                        </TextField>
                        </Box>

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" gutterBottom>Columna de Valor numérico</Typography>
                <TextField
                  fullWidth
                  size="small"
                  select
                  value={columnaValor || ''}
                  onChange={(e) => setColumnaValor(e.target.value)}
                >
                  {columnasNumericas.map((columna) => (
                    <MenuItem key={columna} value={columna}>
                      {columna}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </>
          ) : (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>Filtros avanzados</Typography>
              <Filtros
                data={datosCombinadosApp}
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
                esBusquedaGeneral={false}
              />
            </>
          )}
        </Box>
      ))}
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

            {datosFiltrados.length > 0 && columnas.length > 0 && (
                <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                    <TablaDatos key={`tabla-datos-${datosFiltrados.length}`} datosIniciales={datosFiltrados} columnasDefinidas={columnas} />
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
                                <Typography variant="h6" gutterBottom>Análisis General</Typography>
                                {datosFiltrados.length > 0 && columnas.length > 0 ? (
                                    <>
                                        <SelectoresAgrupacion
                                            columnas={columnas}
                                            columnaAgrupar={columnaAgrupar}
                                            setColumnaAgrupar={setColumnaAgrupar}
                                            columnasNumericas={columnasNumericas}
                                            columnaValor={columnaValor}
                                            setColumnaValor={setColumnaValor}
                                            tipoGrafico={tipoGrafico}
                                            setTipoGrafico={setTipoGrafico}
                                            paleta={paleta}
                                            setPaleta={setPaleta}
                                            ordenarGrafico={ordenarGrafico}
                                            setOrdenarGrafico={setOrdenarGrafico}
                                            topNGrafico={topNGrafico}
                                            setTopNGrafico={setTopNGrafico}
                                            mostrarPorcentajeBarras={mostrarPorcentajeBarras}
                                            setMostrarPorcentajeBarras={setMostrarPorcentajeBarras}
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
                                        <ResumenGeneral datos={datosFiltrados} columnaValor={[columnaValor]} resultadosProcesados={resultadosProcesadosPorHoja} />
                                        <ExportButtons onExportar={handleExportar} />
                                    </>
                                ) : (
                                    <Typography color="info">No hay datos para mostrar el análisis general.</Typography>
                                )}
                            </Box>
                        )}
                    </Box>
                </Paper>
            )}
        </Layout>
    </>
);

};

export default App;