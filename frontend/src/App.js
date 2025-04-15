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

  const [filters, setFilters] = React.useState({
    texto: '',
    fechaInicio: '',
    fechaFin: ''
  });

  const filteredData = useFiltros(datos, filters.texto, filters.fechaInicio, filters.fechaFin);

  const { exportToExcel } = useExportaciones();

  const handleFilterChange = (filtro) => {
    setFilters(prev => ({ ...prev, ...filtro }));
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
            columns={columnas}
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        )}

        <TablaDatos
          data={filteredData}
          columns={columnas}
        />

        <Graficos
          data={filteredData}
          columns={columnas}
        />

        <ExportButtons
          onExport={() => exportToExcel(filteredData, columnas)}
        />

        <Fab
          color="primary"
          aria-label="exportar"
          onClick={() => exportToExcel(filteredData, columnas)}
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








