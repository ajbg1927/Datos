import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material';

const TablaDatos = ({ datos, columnas }) => {
  if (datos.length === 0) {
    return (
      <Typography variant="body1" sx={{ mt: 2 }}>
        No hay datos para mostrar.
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ mt: 4 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            {columnas.map((columna) => (
              <TableCell key={columna}>{columna}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {datos.map((fila, index) => (
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
    </TableContainer>
  );
};

export default TablaDatos;
