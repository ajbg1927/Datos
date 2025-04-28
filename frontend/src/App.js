import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
    Box, CircularProgress, Paper, Tab, Tabs, Typography, TextField, Divider, FormControl, InputLabel, Select, MenuItem, InputAdornment
} from '@mui/material';
import { Toaster, toast } from 'react-hot-toast';
import SearchIcon from '@mui/icons-material/Search';

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
import SelectAnálisisPor from './components/SelectAnálisisPor';
import SelectTotalDe from './components/SelectTotalDe';
import SelectTipoDeGrafico from './components/SelectTipoDeGrafico';

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

  const [datosCombinados, setDatosCombinados] = useState([]);
  const [isLoadingUpload, setIsLoadingUpload] = useState(false);
  const [filtros, setFiltros] = useState({});
  const [columnaAgrupar, setColumnaAgrupar] = useState('');
  const [columnaValor, setColumnaValor] = useState('');
  const [usarDatosFiltrados, setUsarDatosFiltrados] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [tipoGrafico, setTipoGrafico] = useState('Barras');
  const [paleta, setPaleta] = useState('Institucional');
  const [ordenarGrafico, setOrdenarGrafico] = useState(true);
  const [topNGrafico, setTopNGrafico] = useState(10);
  const [mostrarPorcentajeBarras, setMostrarPorcentajeBarras] = useState(false);
  const [resultadosProcesadosPorHoja, setResultadosProcesadosPorHoja] = useState(null);
  const [dependenciasPorHoja, setDependenciasPorHoja] = useState({});
  const [hojaSeleccionada, setHojaSeleccionada] = useState('');
  const [dependenciaSeleccionada, setDependenciaSeleccionada] = useState('');
  const [ticProcesado, setTicProcesado] = useState(false);
  const [cargandoProcesamiento, setCargandoProcesamiento] = useState(false);
  const [checkboxResumenGraficos, setCheckboxResumenGraficos] = useState(false);
  const [datosCombinadosApp, setDatosCombinadosApp] = useState([]);
  const [datosFiltrados, setDatosFiltrados] = useState([]);
  const [columnas, setColumnas] = useState([]);

  const columnas = useMemo(() => (datosCombinados.length > 0 ? Object.keys(datosCombinados[0]) : []), [datosCombinados]);

  const columnasFecha = useMemo(
    () => columnas.filter(col => col.toLowerCase().includes('fecha')),
    [columnas]
  );

  const columnasNumericas = useMemo(
    () => columnas.filter(col => col.toLowerCase().match(/pago|valor|deducci|oblig|monto|total|suma|saldo/)),
    [columnas]
  );

  const valoresUnicos = useMemo(() => {
    const result = {};
    columnas.forEach(col => {
      const valores = datosCombinados.map(row => row[col]).filter(v => v !== undefined && v !== null);
      result[col] = [...new Set(valores)];
    });
    return result;
  }, [columnas, datosCombinados]);

  const filtrosColumnas = useMemo(
    () => Object.fromEntries(Object.entries(filtros).filter(([key]) => !['busqueda', 'Fecha_desde', 'Fecha_hasta'].includes(key))),
    [filtros]
  );

  const datosFiltrados = useFiltrosAvanzado(
    datosCombinados,
    filtros.busqueda || '',
    filtros.Fecha_desde || '',
    filtros.Fecha_hasta || '',
    filtrosColumnas,
    filtros[`${columnaValor}_min`] || '',
    filtros[`${columnaValor}_max`] || '',
    columnaValor
  );

  useEffect(() => {
    if (archivoSeleccionado && hojasSeleccionadas.length > 0) {
      obtenerDatos(archivoSeleccionado.nombreBackend, hojasSeleccionadas)
        .then((data) => {
          if (data) {
            setDatosCombinados(data);
            toast.success(`Datos cargados: ${data.length} registros`);
          }
        })
        .catch(console.error);
    } else {
      setDatosCombinados([]);
    }
  }, [archivoSeleccionado, hojasSeleccionadas, obtenerDatos]);

  useEffect(() => {
    if (archivoSeleccionado && !hojasPorArchivo[archivoSeleccionado.nombreBackend]) {
      obtenerHojas(archivoSeleccionado.nombreBackend);
    }
  }, [archivoSeleccionado, obtenerHojas, hojasPorArchivo]);

  useEffect(() => {
    if (!columnaAgrupar && columnas.length > 0) setColumnaAgrupar(columnas[0]);
    if (!columnaValor && columnasNumericas.length > 0) setColumnaValor(columnasNumericas[0]);
  }, [columnas, columnasNumericas, columnaAgrupar, columnaValor]);

  const { exportToExcel, exportToCSV, exportToPDF, exportToTXT } = useExportaciones();

  const handleArchivoSeleccionadoChange = useCallback((archivo) => {
    setArchivoSeleccionadoFromHook(archivo);
    setHojasSeleccionadasFromHook([]);
  }, [setArchivoSeleccionadoFromHook, setHojasSeleccionadasFromHook]);

  const handleHojasSeleccionadasChange = useCallback((hojas) => {
    setHojasSeleccionadasFromHook(hojas);
  }, [setHojasSeleccionadasFromHook]);

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
    if (newValue === 4 && !ticProcesado && archivoSeleccionado && hojasSeleccionadas.length > 0) {
      handleProcesarDatos();
      setTicProcesado(true);
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
                { esBusquedaGeneral: true, titulo: 'Buscar en todo el archivo' },
                { esBusquedaGeneral: false }
              ].map(({ esBusquedaGeneral, titulo }, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  {titulo && (
                    <Typography variant="h6" gutterBottom>{titulo}</Typography>
                  )}
                  <Filtros
                    data={datosCombinados}
                    columnas={columnas}
                    valoresUnicos={valoresUnicos}
                    filtros={filtros}
                    setFiltros={setFiltros}
                    handleClearFilters={handleClearFilters}
                    columnasFecha={columnasFecha}
                    columnasNumericas={columnasNumericas}
                    valorBusqueda={filtros.busqueda || ''}
                    setValorBusqueda={(valor) => setFiltros(prev => ({ ...prev, busqueda: valor }))}
                    columnaAgrupar={columnaAgrupar}
                    setColumnaAgrupar={setColumnaAgrupar}
                    columnaValor={columnaValor}
                    setColumnaValor={setColumnaValor}
                    esBusquedaGeneral={esBusquedaGeneral}
                  />
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

      {hojaSeleccionada && (
        <Box>
        {columnaAgrupar ? (
            <>
            <ResumenGeneral
            datos={checkboxResumenGraficos ? datosFiltrados : datosCombinadosApp}
            columnaAgrupar={columnaAgrupar}
            columnaValor={columnaValor}
            titulo="Resumen General"
            />
            <Graficos
            datos={checkboxResumenGraficos ? datosFiltrados : datosCombinadosApp}
            columnaAgrupar={columnaAgrupar}
            columnaValor={columnaValor}
            />
            </>
            ) : (
            <Typography variant="body2" color="textSecondary">
            Selecciona una columna para agrupar y ver gráficos y resumen.
            </Typography>
        )}
        </Box>
    )}

    {columnaAgrupar && (
        <Box>
        <ResumenGeneral
        datos={usarDatosFiltrados ? datosFiltrados : datosCombinadosApp}
        columnaAgrupar={columnaAgrupar}
        columnaValor={columnaValor}
        titulo="Resumen General"
        />
        <Graficos
        datos={usarDatosFiltrados ? datosFiltrados : datosCombinadosApp}
        columnaAgrupacion={columnaAgrupar}
        columnaValor={columnaValor}
        tipoGrafico={tipoGrafico}
        paleta={paleta}
        ordenar={ordenarGrafico}
        topN={topNGrafico}
        mostrarPorcentajeBarras={mostrarPorcentajeBarras}
        />
        </Box>
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
                    setHojaSeleccionada(hoja);
                    setDependenciaSeleccionada(dependencia);

                    const datosOriginales = resultadosProcesadosPorHoja?.[hoja] || [];
                    const datosFiltradosInterno = datosOriginales
                      .flat()
                      .filter((row) => row?.Dependencia?.toUpperCase?.() === dependencia.toUpperCase());

                    setDatosFiltrados(datosFiltradosInterno);

                    if (datosFiltradosInterno.length > 0) {
                      setColumnas(Object.keys(datosFiltradosInterno[0]));
                    } else {
                      setColumnas([]);
                    }
                  }}
                />

                <Paper elevation={2} sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Datos</Typography>
                  {cargandoDatosHook ? (
                    <Box display="flex" justifyContent="center"><CircularProgress /></Box>
                  ) : (
                    <TablaDatos datosIniciales={datosFiltrados} columnasDefinidas={columnas} />
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

                  <div className="flex items-center gap-2 mb-4">
                    <input
                      type="checkbox"
                      id="usarDatosFiltrados"
                      checked={usarDatosFiltrados}
                      onChange={(e) => setUsarDatosFiltrados(e.target.checked)}
                    />
                    <label htmlFor="usarDatosFiltrados" className="text-sm">
                      Aplicar filtros también al Resumen y Gráficos
                    </label>
                  </div>

                  {usarDatosFiltrados && (
                    <div className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-xl mb-4">
                      Mostrando datos filtrados
                    </div>
                  )}

                  <ResumenGeneral
                    datos={datosCombinadosApp}
                    columnaValor={columnaValor}
                    resultadosProcesados={resultadosProcesadosPorHoja ? Object.values(resultadosProcesadosPorHoja).flat() : []}
                  />

                  <Graficos
                    datos={usarDatosFiltrados ? datosFiltrados : datosCombinadosApp}
                    columnaAgrupar={columnaAgrupar}
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
  </>
);

};

export default App;