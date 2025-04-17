import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography, Paper } from '@mui/material';
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

      <Paper
        elevation={4}
        sx={{
          mt: 3,
          height: '70vh', 
          width: '100%',
          borderRadius: 3,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ flex: 1, width: '100%', overflow: 'auto' }}>
          <Box sx={{ minWidth: '100%', width: 'max-content' }}>
            <DataGrid
              rows={filas}
              columns={columnasGrid}
              pageSize={25}
              rowsPerPageOptions={[10, 25, 50, 100]}
              disableSelectionOnClick
              autoHeight={false} // Importante: evitar que dependa del padre
              sx={{
                border: 'none',
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: '#388E3C',
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: 14,
                },
                '& .MuiDataGrid-cell': {
                  fontSize: 13,
                  whiteSpace: 'nowrap',
                },
                '& .MuiDataGrid-row:nth-of-type(even)': {
                  backgroundColor: '#f9f9f9',
                },
              }}
            />
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default TablaDatos;