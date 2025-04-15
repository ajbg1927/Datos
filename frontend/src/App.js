import React from 'react';
import { Box, Container, Fab } from '@mui/material';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import Header from './components/Header';
import Footer from './components/Footer';
import UploadFile from './components/UploadFile';
import TablaArchivos from './components/TablaArchivos';
import TablaHojas from './components/TablaHojas';
import Filtros from './components/Filtros';
import TablaDatos from './components/TablaDatos';
import Graficos from './components/Graficos';
import ExportButtons from './components/ExportButtons';
import useArchivos from './hooks/useArchivos';
import useFiltros from './hooks/useFiltros';
import useExportaciones from './hooks/useExportaciones';

function App() {
  const {
    archivos,
    archivoSeleccionado,
    setArchivoSeleccionado,
    hojas,
    hojaSeleccionada,
    setHojaSeleccionada,
    datos,
    columnas
  } = useArchivos();

  const [filtros, setFiltros] = React.useState({
    texto: '',
    fechaInicio: '',
    fechaFin: ''
  });

  const datosFiltrados = useFiltros(datos, filtros.texto, filtros.fechaInicio, filtros.fechaFin);

  const { exportToExcel } = useExportaciones();

  const handleCambioFiltros = (filtro) => {
    setFiltros(prev => ({ ...prev, ...filtro }));
  };

  return (
    <Box sx={{ bgcolor: '#fff', minHeight: '100vh' }}>
      <Header />
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <UploadFile />

        {archivos.length > 0 && (
          <>
            <TablaArchivos
              archivos={archivos}
              archivoSeleccionado={archivoSeleccionado}
              onArchivoChange={setArchivoSeleccionado}
            />
            <TablaHojas
              hojas={hojas}
              hojaSeleccionada={hojaSeleccionada}
              onHojaChange={setHojaSeleccionada}
            />
          </>
        )}

        {columnas.length > 0 && (
          <Filtros
            columnas={columnas}
            filtros={filtros}
            onCambioFiltros={handleCambioFiltros}
          />
        )}

        <TablaDatos
          datos={datosFiltrados}
          columnas={columnas}
        />

        <Graficos
          datos={datosFiltrados}
          columnas={columnas}
        />

        <ExportButtons
          onExport={() => exportToExcel(datosFiltrados, columnas)}
        />

        <Fab
          color="primary"
          aria-label="exportar"
          onClick={() => exportToExcel(datosFiltrados, columnas)}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            backgroundColor: '#ffcd00',
            color: '#000',
            '&:hover': {
              backgroundColor: '#e6b800',
            },
          }}
        >
          <SaveAltIcon />
        </Fab>
      </Container>
      <Footer />
    </Box>
  );
}

export default App;
