import React, { useMemo } from 'react';
import { Paper, Typography, Box, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

const InformeRP = ({ datos }) => {
  const resumenRP = useMemo(() => {
    const resumen = {};
    datos.forEach(row => {
      const rp = row['RP'] || 'Sin RP';
      const valor = parseFloat(row['Valor'] || row['Valor Total'] || 0) || 0;

      if (!resumen[rp]) {
        resumen[rp] = { cantidad: 0, total: 0 };
      }
      resumen[rp].cantidad += 1;
      resumen[rp].total += valor;
    });
    return Object.entries(resumen).map(([rp, { cantidad, total }]) => ({ RP: rp, cantidad, total }));
  }, [datos]);

  if (!resumenRP || resumenRP.length === 0) return null;

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>Resumen por RP</Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell><strong>RP</strong></TableCell>
            <TableCell><strong>Registros</strong></TableCell>
            <TableCell><strong>Total ($)</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {resumenRP.map((rp) => (
            <TableRow key={rp.RP}>
              <TableCell>{rp.RP}</TableCell>
              <TableCell>{rp.cantidad}</TableCell>
              <TableCell>${rp.total.toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default InformeRP;