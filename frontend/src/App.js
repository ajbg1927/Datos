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
import { useFiltros } from './hooks/useFiltros';
import { useExportaciones } from './hooks/useExportaciones';

function App() {
  const {
    files, selectedFileIndex, selectedSheet, data, columns,
    handleFileUpload, handleDrop, handleFileChange, handleSheetChange,
    setSelectedFileIndex, setSelectedSheet
  } = useArchivos();

  const { filters, handleFilterChange, filteredData } = useFiltros(data, columns);

  const { exportToExcel } = useExportaciones(filteredData, selectedSheet);

  return (
    <Box sx={{ bgcolor: '#fff', minHeight: '100vh' }}>
      <Header />
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>

        <UploadFile onDrop={handleDrop} onFileUpload={handleFileUpload} />

        {files.length > 0 && (
          <>
            <TablaArchivos
              files={files}
              selectedFileIndex={selectedFileIndex}
              onFileChange={handleFileChange}
            />
            <TablaHojas
              sheets={files[selectedFileIndex]?.workbook?.SheetNames || []}
              selectedSheet={selectedSheet}
              onSheetChange={handleSheetChange}
            />
          </>
        )}

        {columns.length > 0 && (
          <Filtros
            columns={columns}
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        )}

        <TablaDatos
          data={filteredData}
          columns={columns}
        />

        <Graficos
          data={filteredData}
          columns={columns}
        />

        <ExportButtons
          onExport={exportToExcel}
        />

        <Fab
          color="primary"
          aria-label="exportar"
          onClick={exportToExcel}
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








