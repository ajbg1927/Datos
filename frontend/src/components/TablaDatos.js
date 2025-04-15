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
  Button,
  Box
} from '@mui/material';
import { CSVLink } from 'react-csv';

const TablaDatos = ({ datos, columnas }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  if (datos.length === 0) {
    return (
      <Typography variant="body1" sx={{ mt: 2 }}>
        No hay datos para mostrar.
      </Typography>
    );
  }

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const rowsToShow = datos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
        <CSVLink
          data={datos}
          filename="datos_exportados.csv"
          headers={columnas.map((col) => ({ label: col, key: col }))}
          style={{ textDecoration: 'none' }}
        >
          <Button variant="outlined" color="primary">
            Descargar CSV
          </Button>
        </CSVLink>
      </Box>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {columnas.map((columna) => (
                <TableCell key={columna}>{columna}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rowsToShow.map((fila, index) => (
              <TableRow key={index}>
                {columnas.map((columna) => (
                  <TableCell key={columna}>
                    {typeof fila[columna] === 'number'
                      ? fila[columna].toLocaleString('es-CO')
                      : fila[columna]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={datos.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[10, 25, 50, 100]}
        />
      </TableContainer>
    </Box>
  );
};

export default TablaDatos;