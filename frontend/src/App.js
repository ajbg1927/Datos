import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  lazy,
  Suspense,
  useRef,
} from 'react';
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  Paper,
} from '@mui/material';

import Layout from './components/Layout';
import UploadFile from './components/UploadFile';
import TablaArchivos from './components/TablaArchivos';
import SelectorHojas from './components/SelectorHojas';
import Filtros from './components/Filtros';
import ExportButtons from './components/ExportButtons';
import ResumenGeneral from './components/ResumenGeneral';

import useArchivos from './hooks/useArchivos';
import useFiltrosAvanzado from './hooks/useFiltrosAvanzado';
import useExportaciones from './hooks/useExportaciones';

import axios from 'axios';

const TablaDatos = lazy(() => import('./components/TablaDatos'));
const Graficos = lazy(() => import('./components/Graficos'));
const SelectoresAgrupacion = lazy(() =>
  import('./components/SelectoresAgrupacion')
);

const API_URL = process.env.REACT_APP_API_URL;
const LOCAL_STORAGE_KEY = 'dataAnalysisAppState';

const App = () => {
  const {
    archivos,
    archivoSeleccionado,
    setArchivoSeleccionado,
    hojasSeleccionadas,
    setHojasSeleccionadas,
    hojasPorArchivo,
    obtenerDatos,
    datosCombinados,
    cargarArchivos,
  } = useArchivos();

  const [filtros, setFiltros] = useState({});
  const [columnaAgrupar, setColumnaAgrupar] = useState('');
  const [columnaValor, setColumnaValor] = useState('');
  const [isLoadingUpload, setIsLoadingUpload] = useState(false);
  const [tipoGrafico, setTipoGrafico] = useState('Barras');
  const [paleta, setPaleta] = useState('Institucional');
  const [ordenarGrafico, setOrdenarGrafico] = useState(true);
  const [topNGrafico, setTopNGrafico] = useState(10);

  // Persistencia en localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}');
    if (saved.filtros) setFiltros(saved.filtros);
    if (saved.columnaAgrupar) setColumnaAgrupar(saved.columnaAgrupar);
    if (saved.columnaValor) setColumnaValor(saved.columnaValor);
  }, []);

  useEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify({ filtros, columnaAgrupar, columnaValor })
    );
  }, [filtros, columnaAgrupar, columnaValor]);

  // Carga de datos al seleccionar archivo/hojas
  useEffect(() => {
    if (archivoSeleccionado && hojasSeleccionadas.length) {
      obtenerDatos(archivoSeleccionado.nombreBackend, hojasSeleccionadas);
    }
  }, [archivoSeleccionado, hojasSeleccionadas, obtenerDatos]);

  // Preseleccionar primera hoja
  useEffect(() => {
    if (
      archivoSeleccionado &&
      hojasPorArchivo[archivoSeleccionado.nombreBackend] &&
      !hojasSeleccionadas.length
    ) {
      setHojasSeleccionadas([
        hojasPorArchivo[archivoSeleccionado.nombreBackend][0],
      ]);
    }
  }, [archivoSeleccionado, hojasPorArchivo, setHojasSeleccionadas]);

  const datos = datosCombinados();

  // Memoización de columnas y valores únicos
  const columnas = useMemo(() => {
    const setCols = new Set();
    datos.forEach((row) => Object.keys(row).forEach((k) => setCols.add(k)));
    return Array.from(setCols);
  }, [datos]);

  const columnasFecha = useMemo(
    () => columnas.filter((c) => c.toLowerCase().includes('fecha')),
    [columnas]
  );

  const columnasNumericas = useMemo(
    () =>
      columnas.filter((c) =>
        c.toLowerCase().match(
          /pago|valor|deducci|oblig|monto|total|suma|saldo/
        )
      ),
    [columnas]
  );

  const valoresUnicos = useMemo(() => {
    const obj = {};
    columnas.forEach((col) => {
      const vals = datos
        .map((row) => row[col])
        .filter((v) => v !== undefined && v !== null);
      obj[col] = [...new Set(vals)];
    });
    return obj;
  }, [datos, columnas]);

  // Inicialización de columnas de agrupación y valor
  useEffect(() => {
    if (columnas.length && !columnaAgrupar) {
      setColumnaAgrupar(columnas[0]);
    }
    if (columnasNumericas.length && !columnaValor) {
      setColumnaValor(columnasNumericas[0]);
    }
  }, [columnas, columnasNumericas, columnaAgrupar, columnaValor]);

  // Preparar filtros para el hook
  const texto = filtros.busqueda || '';
  const fechaInicio = filtros.Fecha_desde || '';
  const fechaFin = filtros.Fecha_hasta || '';
  const filtrosColumnas = Object.fromEntries(
    Object.entries(filtros).filter(
      ([k]) => !['busqueda', 'Fecha_desde', 'Fecha_hasta'].includes(k)
    )
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

  const { exportToExcel, exportToCSV, exportToPDF, exportToTXT } =
    useExportaciones();

  const handleClearFilters = useCallback(() => {
    setFiltros({});
  }, []);

  const handleExportar = useCallback(
    (formato) => {
      switch (formato) {
        case 'excel':
          return exportToExcel(datosFiltrados, columnas);
        case 'csv':
          return exportToCSV(datosFiltrados, columnas);
        case 'pdf':
          return exportToPDF(datosFiltrados, columnas);
        case 'txt':
          return exportToTXT(datosFiltrados, columnas);
        default:
          return exportToExcel(datosFiltrados, columnas);
      }
    },
    [datosFiltrados, columnas, exportToCSV, exportToExcel, exportToPDF, exportToTXT]
  );

  const handleArchivosSubidos = useCallback(
    async (files) => {
      const formData = new FormData();
      files.forEach((f) => formData.append('archivos', f));
      setIsLoadingUpload(true);
      try {
        await axios.post(`${API_URL}/subir`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        await cargarArchivos(files);
      } catch (e) {
        console.error(e);
        alert('Error al subir archivos');
      } finally {
        setIsLoadingUpload(false);
      }
    },
    [cargarArchivos]
  );

  // Ref para auto-scroll
  const datosRef = useRef();
  useEffect(() => {
    if (datos.length) {
      datosRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [datos]);

  return (
    <Layout
      sidebar={
        <Paper
          elevation={1}
          sx={{
            p: 3,
            borderRadius: 3,
            backgroundColor: 'white',
            maxHeight: '80vh',
            overflow: 'auto',
          }}
        >
          {columnas.length ? (
            <Filtros
              columnas={columnas}
              valoresUnicos={valoresUnicos}
              filtros={filtros}
              setFiltros={setFiltros}
              handleClearFilters={handleClearFilters}
              columnasFecha={columnasFecha}
              columnasNumericas={columnasNumericas}
              valorBusqueda={texto}
              setValorBusqueda={(v) =>
                setFiltros((prev) => ({ ...prev, busqueda: v }))
              }
              columnaAgrupar={columnaAgrupar}
              setColumnaAgrupar={setColumnaAgrupar}
              columnaValor={columnaValor}
              setColumnaValor={setColumnaValor}
            />
          ) : (
            <Typography variant="body2" color="textSecondary">
              Selecciona un archivo para ver los filtros.
            </Typography>
          )}
        </Paper>
      }
    >
      {isLoadingUpload && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          my={2}
        >
          <CircularProgress sx={{ mr: 2 }} />
          <Typography>Subiendo archivo(s)... por favor espera</Typography>
        </Box>
      )}

      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <UploadFile onFilesUploaded={handleArchivosSubidos} />
      </Paper>

      {archivos.length > 0 && (
        <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            📁 Archivos Cargados
          </Typography>
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

      {datos.length > 0 && (
        <Box display="flex" flexDirection="column" gap={3}>
          <Paper elevation={2} sx={{ p: 3 }} ref={datosRef}>
            <Typography variant="h6" gutterBottom>
              📄 Datos
            </Typography>
            <Suspense fallback={<CircularProgress />}>
              <TablaDatos datos={datosFiltrados} columnas={columnas} />
            </Suspense>
          </Paper>

          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              📊 Análisis
            </Typography>
            <Suspense fallback={<CircularProgress />}>
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
              />
              <ResumenGeneral
                datos={datosFiltrados}
                columnaValor={columnaValor}
              />
              <Graficos
                datos={datosFiltrados}
                columnaAgrupacion={columnaAgrupar}
                columnaValor={columnaValor}
                tipoGrafico={tipoGrafico}
                paleta={paleta}
                ordenar={ordenarGrafico}
                topN={topNGrafico}
              />
            </Suspense>
          </Paper>

          <Paper elevation={2} sx={{ p: 2 }}>
            <ExportButtons
              datos={datosFiltrados}
              columnas={columnas}
              onExport={handleExportar}
            />
          </Paper>
        </Box>
      )}
    </Layout>
  );
};

export default App;