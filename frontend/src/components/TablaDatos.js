import React from 'react';
import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import ExportButtons from './ExportButtons';

const TablaDatos = ({ datosFiltrados }) => {
  if (!datosFiltrados || datosFiltrados.length === 0) {
    return null;
  }

  const columnas = Object.keys(datosFiltrados[0]);
  const columnasFiltradas = columnas.filter((col) => col !== '__rowNum__');

  const columnasGrid = columnasFiltradas.map((col) => ({
    field: col,
    headerName: col,
    flex: 1,
    minWidth: 200, // Aumenta ancho mínimo para columnas legibles
  }));

  const filas = datosFiltrados.map((fila, index) => ({
    id: index,
    ...fila,
  }));

  return (
    <Box
      sx={{
        height: '80vh',
        width: '100%',
        mt: 2,
        backgroundColor: 'white',
        borderRadius: 3,
        overflowX: 'auto', 
      }}
    >
      <DataGrid
        rows={filas}
        columns={columnasGrid}
        pageSize={25}
        rowsPerPageOptions={[10, 25, 50, 100]}
        checkboxSelection={false}
        disableSelectionOnClick
        autoHeight={false}
        sx={{
          minWidth: '1000px',
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#388E3C', 
            color: 'white',
            fontWeight: 'bold',
          },
          '& .MuiDataGrid-row:nth-of-type(even)': {
            backgroundColor: '#f5f5f5',
          },
        }}
      />

      {/* Botones de exportación flotantes */}
      <ExportButtons datos={datosFiltrados} />
    </Box>
  );
};

export default TablaDatos;