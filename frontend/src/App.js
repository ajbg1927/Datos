import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
    Box, CircularProgress, Paper, Tab, Tabs, Typography, TextField, Divider, FormControl, InputLabel, Select, MenuItem, InputAdornment, ToggleButton, ToggleButtonGroup
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
import ExportFloatingButton from './components/ExportFloatingButton';
import SelectorDeCuadro from './components/SelectorDeCuadro';
import SelectorColumnas from './components/SelectorColumnas';
import InformePresupuestal from './components/InformePresupuestal';
import InformeRP from './components/InformeRP';

import useArchivos from './hooks/useArchivos';
import useFiltrosAvanzado from './hooks/useFiltrosAvanzado';
import useExportaciones from './hooks/useExportaciones';
import useGraficos from './hooks/useGraficos';
import useGraficoConfig from './hooks/useGraficoConfig';
import useCuadrosExcel from './hooks/useCuadrosExcel';
import useInformeRP from './hooks/useInformeRP';
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

  const { cuadros, cuadroSeleccionado, seleccionarCuadro } = useCuadrosExcel(datosFiltrados);
  const { resumen: resumenRP, mapaContratistas } = useInformeRP({ cuadros, datos2: datosEnlazados });
  const datosActivos = cuadroSeleccionado?.datos?.length > 0 ? cuadroSeleccionado.datos : datosFiltrados;

  const [columnas, setColumnas] = useState([]);

  const [datosEnlazados, setDatosEnlazados] = useState([]);

  useEffect(() => {
    if (!datosActivos || datosActivos.length === 0) {
      setDatosEnlazados([]);
      return;
    }

    const archivoContratistas = archivos.find((a) =>
      (hojasPorArchivo[a.nombreBackend] || []).some(h => 
        h?.nombreHoja?.toLowerCase().includes('contratista')
        )
      );

    if (!archivoContratistas) {
      setDatosEnlazados(datosActivos);
      return;
    }

    const hojaContratista = hojasPorArchivo[archivoContratistas.nombreBackend].find(h =>
      typeof h.nombreHoja === 'string' && h.nombreHoja.toLowerCase().includes('contratista')
      );

    if (!hojaContratista || !hojaContratista.datos || hojaContratista.datos.length === 0) {
      setDatosEnlazados(datosActivos);
      return;
    }

    const datosContratistas = hojaContratista.datos;

    const contratistasPorRP = datosContratistas.reduce((acc, fila) => {
      const clave = fila.RP?.toString().trim();
      if (clave) {
        acc[clave] = fila;
      }
      return acc;
    }, {});

    const datosFusionados = datosActivos.map(fila => {
      const clave = fila.RP?.toString().trim();
      const infoContratista = contratistasPorRP[clave];
      return infoContratista ? { ...fila, ...infoContratista } : fila;
    });

    setDatosEnlazados(datosFusionados);
   }, [datosActivos, archivos, hojasPorArchivo]);

  useEffect(() => {
    if (datosCombinados.length > 0) {
      setColumnas(Object.keys(datosCombinados[0]));
    } else {
      setColumnas([]);
    }
  }, [datosCombinados]);

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

  const datosFiltradosHook = useFiltrosAvanzado(
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
    setDatosFiltrados(datosFiltradosHook);
  }, [datosFiltradosHook]);

  useEffect(() => {
    if (archivoSeleccionado && hojasSeleccionadas.length > 0) {
      obtenerDatos(archivoSeleccionado.nombreBackend, hojasSeleccionadas)
        .then((data) => {
          if (data) {
            setDatosCombinados(data);
            setDatosCombinadosApp(data);
            toast.success(`Datos cargados: ${data.length} registros`);
          }
        })
        .catch(console.error);
    } else {
      setDatosCombinados([]);
      setDatosCombinadosApp([]);
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

  const handleHojasSeleccionadasChange = (hojas) => {
  if (!Array.isArray(hojas)) {
    console.warn("handleHojasSeleccionadasChange recibió algo que no es un array:", hojas);
    setHojasSeleccionadasFromHook([]);
    setDatosCombinados([]);
    return;
  }

  setHojasSeleccionadasFromHook(hojas);

  if (!archivoSeleccionado || hojas.length === 0) {
    setDatosCombinados([]);
    return;
  }

  const hojasDelArchivo = hojasPorArchivo[archivoSeleccionado.nombreBackend] || [];

  const datosSeleccionados = hojas.flatMap((hoja) => {
    const datosHoja = hojasDelArchivo.find(h => h.nombreHoja === hoja);
    return datosHoja?.datos || [];
  });

  setDatosCombinados(datosSeleccionados);
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

  const handleClearFilters = () => setFiltros({});

  const handleExportar = (formato) => {
    const exportadores = {
      excel: exportToExcel,
      csv: exportToCSV,
      pdf: exportToPDF,
      txt: exportToTXT,
    };
    (exportadores[formato] || exportToExcel)(datosActivos, columnas);
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

  const columnasDisponibles = datosCombinados.length > 0 ? Object.keys(datosCombinados[0]) : [];

  const datosGraficos = useGraficos(
    usarDatosFiltrados ? datosFiltrados : datosCombinadosApp,
    columnaAgrupar,
    columnaValor
    );

  const nombreCuadro = cuadroSeleccionado?.cuadro || '';
  const esCuadroRP = (nombre = '') =>
  nombre.toLowerCase().includes('registro') && nombre.toLowerCase().includes('rp');

  const cuadroEsRP = esCuadroRP(cuadroSeleccionado?.nombre);

  const cuadroEsCDP = nombreCuadro.toLowerCase().includes('cdp');
  const cuadroEsCompromiso = nombreCuadro.toLowerCase().includes('compromiso');

 return (
  <>
    <Toaster position="bottom-right" />

    <Layout
      sidebar={
        <Paper elevation={1} sx={{ p: 3, borderRadius: 3, backgroundColor: 'white' }}>
          {columnas.length > 0 ? (
            <>
              {[{ esBusquedaGeneral: true, titulo: 'Buscar en todo el archivo' }, { esBusquedaGeneral: false }].map(
                ({ esBusquedaGeneral, titulo }, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    {titulo && (
                      <Typography variant="h6" gutterBottom>
                        {titulo}
                      </Typography>
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
                      setValorBusqueda={(valor) => setFiltros((prev) => ({ ...prev, busqueda: valor }))}
                      columnaAgrupar={columnaAgrupar}
                      setColumnaAgrupar={setColumnaAgrupar}
                      columnaValor={columnaValor}
                      setColumnaValor={setColumnaValor}
                      esBusquedaGeneral={esBusquedaGeneral}
                    />
                  </Box>
                )
              )}
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
          <Typography variant="h6" gutterBottom>
            Archivos Cargados
          </Typography>
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
          <SelectorDeCuadro
          cuadros={cuadros}
          seleccionarCuadro={seleccionarCuadro}
          cuadroSeleccionado={cuadroSeleccionado}
          />
        </Paper>
      )}

      {datosActivos.length > 0 && columnas.length > 0 && (
        <>
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <TablaDatos key={`tabla-datos-${datosActivos.length}`} datosIniciales={datosActivos} columnasDefinidas={columnas} />
        </Paper>

        {(cuadroEsRP || cuadroEsCompromiso || cuadroEsCDP) && (
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
          Informe Presupuestal Automático
          </Typography>
          <InformePresupuestal datos={datosActivos} />
          </Paper>
        )}

        {cuadroEsRP && (
          <>
          {console.log('Mostrando InformeRP con datosEnlazados:', datosEnlazados)}
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
          Detalle de Registros Presupuestales (RP)
          </Typography>
          <InformeRP datos={datosEnlazados} />
          </Paper>

          {cuadroEsRP && resumenRP?.length > 0 && (
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
            Resumen por RP
            </Typography>
            <InformeRP datos={resumenRP} mapaContratistas={mapaContratistas} />
            </Paper>
          )}
          </>
        )}
      
      {columnaAgrupar && columnaValor && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>Opciones de Gráfico</Typography>

          <SelectorColumnas
            columnas={columnasDisponibles}
            columnaAgrupar={columnaAgrupar}
            setColumnaAgrupar={setColumnaAgrupar}
            columnaValor={columnaValor}
            setColumnaValor={setColumnaValor}
          />

          <Graficos
            datosAgrupados={datosGraficos}
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
        <Paper elevation={2} sx={{ width: '100%', mt: 4 }}>
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
                  <Box display="flex" justifyContent="center">
                    <CircularProgress />
                  </Box>
                ) : (
                  Object.entries(resultadosProcesadosPorHoja).map(([nombreHoja, tablas]) => (
                    <Box key={nombreHoja} mb={3}>
                      <Typography variant="subtitle1">Hoja: {nombreHoja}</Typography>
                      {Array.isArray(tablas) && tablas.length > 0 ? (
                        tablas.map((tabla, index) => (
                          <Paper key={`${nombreHoja}-${index}`} elevation={1} sx={{ mt: 1, p: 2 }}>
                            <Typography variant="body2" fontWeight="bold">
                              Tabla {index + 1}
                            </Typography>
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
          </Box>
        </Paper>
      )}

      {datosActivos.length > 0 && columnas.length > 0 && (
        <ExportFloatingButton
        datos={datosActivos}
        columnas={columnas}
        filename="exportacion_mis_datos"
        />
      )}
    </Layout>
  </>
);

};

export default App;