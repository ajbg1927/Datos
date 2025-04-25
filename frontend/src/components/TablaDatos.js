import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const TablaDatos = ({ datos, columnas }) => {
  const datosVacios = !datos || datos.length === 0;

  const columnasFinales = columnas && columnas.length > 0
    ? columnas
    : datos && datos.length > 0
      ? Object.keys(datos[0]).filter(key => key && key.trim() !== '')
      : [];

  const columnasDataGrid = columnasFinales.map((columna, index) => ({
    field: columna,
    headerName: columna,
    flex: 1,
    minWidth: 150,
    sortable: true,
    headerAlign: 'center',
    align: 'center',
  }));

  const filas = datos && datos.length > 0
    ? datos.map((fila, index) => ({ id: index, ...fila }))
    : [];

  if (datosVacios || columnasDataGrid.length === 0) {
    console.log("Sin datos o columnas válidas. No se mostrará tabla.");
    return (
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <InfoOutlinedIcon sx={{ fontSize: 80, color: 'grey.400' }} />
        <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
          No hay datos estructurados para mostrar
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Asegúrate de seleccionar una hoja con datos válidos.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <DataGrid
        rows={filas}
        columns={columnasDataGrid}
        pageSize={10}
        rowsPerPageOptions={[10, 25, 50, 100]}
        sx={{
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 2,
          '& .MuiDataGrid-columnHeaders': { bgcolor: 'primary.light', color: 'primary.contrastText' },
        }}
      />
    </Box>
  );
};

export default TablaDatos;