import React, { useMemo } from 'react';
import { Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

const normalizarTexto = (texto) =>
  texto?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const InformeRP = ({ datos, mapaContratistas = {} }) => {
  const resumenRP = useMemo(() => {
    if (!Array.isArray(datos) || datos.length === 0) return [];

    const columnas = Object.keys(datos[0]);
    const claveRP = columnas.find((col) => normalizarTexto(col).includes('rp')) || 'RP';

    const posiblesValores = ['valor', 'valor total', 'monto', 'total'];
    const claveValor =
      columnas.find((col) =>
        posiblesValores.some((v) => normalizarTexto(col).includes(v))
      ) || 'Valor';

    const resumen = {};

    datos.forEach((row) => {
      const rp = row[claveRP] || 'Sin RP';
      const valor = parseFloat(row[claveValor]) || 0;

      if (!resumen[rp]) {
        resumen[rp] = { cantidad: 0, total: 0 };
      }

      resumen[rp].cantidad += 1;
      resumen[rp].total += valor;
    });

    return Object.entries(resumen).map(([rp, { cantidad, total }]) => ({
      RP: rp,
      cantidad,
      total,
    }));
  }, [datos]);

  if (!resumenRP.length) return null;

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Resumen por RP
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell><strong>RP</strong></TableCell>
            <TableCell><strong>Contratista</strong></TableCell>
            <TableCell><strong>Registros</strong></TableCell>
            <TableCell><strong>Total ($)</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {resumenRP.map((rp) => (
            <TableRow key={rp.RP}>
              <TableCell>{rp.RP}</TableCell>
              <TableCell>{mapaContratistas[rp.RP] || 'No encontrado'}</TableCell>
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