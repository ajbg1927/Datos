import React, { useState, useEffect } from 'react';
import { Container, Paper, Typography, Box } from '@mui/material';
import Header from './components/Header';
import Footer from './components/Footer';
import UploadFile from './components/UploadFile';
import TablaArchivos from './components/TablaArchivos';
import TablaHojas from './components/TablaHojas';
import Filtros from './components/Filtros';
import TablaDatos from './components/TablaDatos';
import ColumnSelector from './components/ColumnSelector';
import Graficos from './components/Graficos';
import ExportButtons from './components/ExportButtons';
import useArchivos from './hooks/useArchivos';
import useFiltros from './hooks/useFiltros';

const App = () => {
  const {
    archivos,
    hojasDisponibles,
    datosCombinados,
    columnas,
    cargarArchivos,
    seleccionarArchivo,
    seleccionarHojas,
    archivoSeleccionado,
    hojasSeleccionadas
  } = useArchivos();

  const {
    filtros,
    setFiltros,
    datosFiltrados,
    limpiarFiltros
  } = useFiltros(datosCombinados, columnas);

  const [columnaAgrupar, setColumnaAgrupar] = useState('Dependencia');
  const [columnaValor, setColumnaValor] = useState('Pagos');

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Header />

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>1. Carga de Archivos</Typography>
        <UploadFile onFilesProcessed={cargarArchivos} />
      </Paper>

      {archivos.length > 0 && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>2. Selección de Archivo y Hojas</Typography>
          <TablaArchivos
            archivos={archivos}
            archivoSeleccionado={archivoSeleccionado}
            seleccionarArchivo={seleccionarArchivo}
          />
          <TablaHojas
            hojasDisponibles={hojasDisponibles}
            hojasSeleccionadas={hojasSeleccionadas}
            seleccionarHojas={seleccionarHojas}
          />
        </Paper>
      )}

      {datosCombinados.length > 0 && (
        <>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>3. Filtros</Typography>
            <Filtros
              columnas={columnas}
              filtros={filtros}
              setFiltros={setFiltros}
              limpiarFiltros={limpiarFiltros}
            />
          </Paper>

          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>4. Visualización de Datos</Typography>
            <TablaDatos datos={datosFiltrados} />
          </Paper>

          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>5. Visualización Gráfica</Typography>
            <ColumnSelector
              columnas={columnas}
              columnaAgrupar={columnaAgrupar}
              setColumnaAgrupar={setColumnaAgrupar}
              columnaValor={columnaValor}
              setColumnaValor={setColumnaValor}
            />
            <Graficos
              datos={datosFiltrados}
              columnaAgrupar={columnaAgrupar}
              columnaValor={columnaValor}
            />
          </Paper>

          <ExportButtons datos={datosFiltrados} />
        </>
      )}

      <Footer />
    </Container>
  );
};

export default App;







