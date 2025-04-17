import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TablePagination,
  Box,
} from '@mui/material';
import ExportButtons from './ExportButtons';

const TablaDatos = ({ datos, columnas, onExport }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const rowsToShow = datos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  if (!datos || datos.length === 0) {
    return (
      <Typography variant="body1" sx={{ mt: 2 }}>
        No hay datos para mostrar.
      </Typography>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <ExportButtons datos={datos} columnas={columnas} onExport={onExport} />

      <TableContainer component={Paper} sx={{ mt: 2, borderRadius: 3, maxHeight: '70vh' }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {columnas.map((columna) => (
                <TableCell
                  key={columna}
                  sx={{
                    backgroundColor: '#388E3C',
                    color: 'white',
                    fontWeight: 'bold',
                    borderBottom: '1px solid #ccc',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                  }}
                >
                  {columna}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rowsToShow.map((fila, idx) => (
              <TableRow key={idx}>
                {columnas.map((col) => (
                  <TableCell key={col}>{fila[col]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={datos.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Filas por página"
        sx={{ mt: 2 }}
      />
    </Box>
  );
};

export default TablaDatos;