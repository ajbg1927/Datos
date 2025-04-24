import React, { useEffect, useState } from 'react';
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
    setArchivoSeleccionado,
    hojasSeleccionadas,
    setHojasSeleccionadas,
    hojasPorArchivo,
    datosPorArchivo,
    columnasPorArchivo,
    obtenerDatos,
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
  const [resultadosProcesados, setResultadosProcesados] = useState(null);
  const [ticProcesado, setTicProcesado] = useState(false);
  const [datosCombinadosApp, setDatosCombinadosApp] = useState([]);

  const ticKeywords = [
    "FUNCIONAMIENTO", "INVERSION", "CUENTAS POR PAGAR", "CDP",
    "VALOR CDP", "DIAS ABIERTOS", "RP", "VALOR INICIAL",
    "PAGOS", "DIAS", "% GASTO"
  ];

  useEffect(() => {
    if (archivoSeleccionado?.nombreBackend && hojasSeleccionadas.length > 0) {
      obtenerDatos(archivoSeleccionado.nombreBackend, hojasSeleccionadas);
    }
  }, [archivoSeleccionado, hojasSeleccionadas, obtenerDatos]);

  useEffect(() => {
    if (archivoSeleccionado && !hojasPorArchivo[archivoSeleccionado.nombreBackend]) {
      obtenerHojas(archivoSeleccionado.nombreBackend);
    }
  }, [archivoSeleccionado, obtenerHojas, hojasPorArchivo]);

  useEffect(() => {
    if (resultadosProcesados) {
      const informe = resultadosProcesados.find(tabla => tabla.nombre?.toLowerCase() === 'informe');
      setInformeData(informe?.data?.[0] || null);
      setTicProcesado(true);
    }
  }, [resultadosProcesados]);

  useEffect(() => {
    if (archivoSeleccionado?.nombreBackend && hojasSeleccionadas.length > 0 && datosPorArchivo[archivoSeleccionado.nombreBackend]?.combinado) {
      setDatosCombinadosApp(datosPorArchivo[archivoSeleccionado.nombreBackend].combinado);
    } else {
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

  const handleArchivosSubidos = async (files) => {
    const formData = new FormData();
    files.forEach(file => formData.append('archivos', file));
    try {
      setIsLoadingUpload(true);
      await axios.post(`${API_URL}/subir`, formData);
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
        const response = await axios.post(`${API_URL}/procesar_excel`, formData);
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
              <FiltroRapidoTIC
                columns={columnas}
                setFiltrosActivos={setFiltros}
                filtrosActivos={filtros}
                data={datosFiltrados}
              />
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
              Selecciona un archivo para ver filtros.
            </Typography>
          )}
        </Paper>
      }
    >
      <UploadFile onUpload={handleArchivosSubidos} isLoading={isLoadingUpload} />
      <TablaArchivos archivos={archivos} setArchivoSeleccionado={setArchivoSeleccionado} />
      {archivoSeleccionado && (
        <SelectorHojas
          hojasDisponibles={hojasPorArchivo[archivoSeleccionado.nombreBackend] || []}
          hojasSeleccionadas={hojasSeleccionadas}
          setHojasSeleccionadas={setHojasSeleccionadas}
        />
      )}
      <Tabs value={tabValue} onChange={handleChangeTab} sx={{ my: 2 }}>
        <Tab label="Resumen General" />
        <Tab label="Datos y Gráficos" />
      </Tabs>

      {tabValue === 0 && (
        <ResumenGeneral informeData={informeData} />
      )}

      {tabValue === 1 && (
        <>
          <ExportButtons onExport={handleExportar} />
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
            ordenarGrafico={ordenarGrafico}
            setOrdenarGrafico={setOrdenarGrafico}
            topNGrafico={topNGrafico}
            setTopNGrafico={setTopNGrafico}
            mostrarPorcentajeBarras={mostrarPorcentajeBarras}
            setMostrarPorcentajeBarras={setMostrarPorcentajeBarras}
          />
          <Graficos
            datos={datosFiltrados}
            columnaAgrupar={columnaAgrupar}
            columnaValor={columnaValor}
            tipo={tipoGrafico}
            paleta={paleta}
            ordenar={ordenarGrafico}
            topN={topNGrafico}
            mostrarPorcentaje={mostrarPorcentajeBarras}
          />
          <TablaDatos datos={datosFiltrados} />
        </>
      )}
    </Layout>
  );
};

export default App;