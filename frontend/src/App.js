import React, { useEffect, useState } from 'react';
import {
  Container,
  CssBaseline,
  CircularProgress,
} from '@mui/material';
import Layout from './components/Layout';
import UploadFile from './components/UploadFile';
import TablaArchivos from './components/TablaArchivos';
import SelectorHojas from './components/SelectorHojas';
import Filtros from './components/Filtros';
import TablaDatos from './components/TablaDatos';
import Graficos from './components/Graficos';
import ResumenGeneral from './components/ResumenGeneral';
import useArchivos from './hooks/useArchivos';
import useFiltrosAvanzado from './hooks/useFiltrosAvanzado';
import useExportaciones from './hooks/useExportaciones';

const App = () => {
  const {
    archivos,
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
  } = useArchivos();

  const [filtros, setFiltros] = useState({});
  const [columnaAgrupar, setColumnaAgrupar] = useState('');
  const [columnaValor, setColumnaValor] = useState('');
  const [isLoadingUpload, setIsLoadingUpload] = useState(false);

  useEffect(() => {
    if (archivoSeleccionado && hojasSeleccionadas.length > 0) {
      obtenerDatos(archivoSeleccionado.nombreBackend, hojasSeleccionadas);
    }
  }, [archivoSeleccionado, hojasSeleccionadas]);

  useEffect(() => {
    if (archivoSeleccionado && hojasPorArchivo[archivoSeleccionado.nombreBackend]) {
      const hojas = hojasPorArchivo[archivoSeleccionado.nombreBackend];
      if (hojas.length > 0 && hojasSeleccionadas.length === 0) {
        setHojasSeleccionadas([hojas[0]]);
      }
    }
  }, [archivoSeleccionado, hojasPorArchivo]);

  const datos = datosCombinados();

  // Detectar columnas disponibles dinámicamente
  const columnas = columnasPorArchivo[archivoSeleccionado?.nombreBackend] || [];
  const columnasValidas = columnas.filter(col => col && !col.toLowerCase().includes('unnamed'));

  // Columnas automáticas
  const columnasFecha = columnasValidas.filter(col => /fecha/i.test(col));
  const columnasNumericas = columnasValidas.filter(col =>
    datos.some(d => !isNaN(parseFloat(d[col])))
  );

  // Obtener valores únicos por columna
  const valoresUnicos = {};
  columnasValidas.forEach(col => {
    valoresUnicos[col] = [...new Set(datos.map(row => row[col]))].filter(v => v !== null && v !== undefined && v !== '');
  });

  const datosFiltrados = useFiltrosAvanzado(datos, filtros, columnasFecha, columnasNumericas);

  const { handleExport } = useExportaciones();

  return (
    <Layout>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <UploadFile onUpload={cargarArchivos} isLoading={isLoadingUpload} setIsLoading={setIsLoadingUpload} />
        <TablaArchivos archivos={archivos} archivoSeleccionado={archivoSeleccionado} setArchivoSeleccionado={setArchivoSeleccionado} />
        <SelectorHojas hojas={hojasPorArchivo[archivoSeleccionado?.nombreBackend] || []} hojasSeleccionadas={hojasSeleccionadas} setHojasSeleccionadas={setHojasSeleccionadas} />
        <Filtros
          columnas={columnasValidas}
          valoresUnicos={valoresUnicos}
          filtros={filtros}
          setFiltros={setFiltros}
          columnasFecha={columnasFecha}
          columnasNumericas={columnasNumericas}
          columnaAgrupacion={columnaAgrupar}
          setColumnaAgrupacion={setColumnaAgrupar}
          columnaValor={columnaValor}
          setColumnaValor={setColumnaValor}
          handleClearFilters={() => setFiltros({})}
        />
        <ResumenGeneral datos={datosFiltrados} columnaValor={columnaValor} />
        <Graficos datos={datosFiltrados} columnaAgrupacion={columnaAgrupar} columnaValor={columnaValor} />
        <TablaDatos datos={datosFiltrados} columnas={columnasValidas} onExport={() => handleExport(datosFiltrados, columnasValidas)} />
      </Container>
    </Layout>
  );
};

export default App;
