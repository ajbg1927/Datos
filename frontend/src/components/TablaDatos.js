import React from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Paper, TableContainer } from '@mui/material';

const TablaDatos = ({ datos, columnasVisibles }) => {
  return (
    <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {columnasVisibles.map((col) => (
              <TableCell key={col}>{col}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {datos.map((fila, index) => (
            <TableRow key={index}>
              {columnasVisibles.map((col) => (
                <TableCell key={col}>{fila[col]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TablaDatos;