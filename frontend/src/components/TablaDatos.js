import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';
import ExportButtons from './ExportButtons';

const TablaDatos = ({ datos, columnas, onExport }) => {
  if (!datos || datos.length === 0) {
    return (
      <Typography variant="body1" sx={{ mt: 2 }}>
        No hay datos para mostrar.
      </Typography>
    );
  }

  const columnasFiltradas = columnas.filter(
    (col) => col && !col.toLowerCase().includes('unnamed')
  );

  const columnasGrid = columnasFiltradas.map((col) => ({
    field: col,
    headerName: col,
    flex: 1,
    minWidth: 150,
  }));

  const filas = datos.map((fila, idx) => ({
    id: idx,
    ...fila,
  }));

  return (
    <Box sx={{ mt: 4 }}>
      <ExportButtons datos={datos} columnas={columnasFiltradas} onExport={onExport} />

      <Box
        sx={{
          height: 600,
          width: '100%',
          mt: 2,
          backgroundColor: 'white',
          borderRadius: 3,
        }}
      >
        <DataGrid
          rows={filas}
          columns={columnasGrid}
          pageSize={25}
          rowsPerPageOptions={[10, 25, 50, 100]}
          checkboxSelection={false}
          disableSelectionOnClick
          sx={{
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
      </Box>
    </Box>
  );
};

export default TablaDatos;