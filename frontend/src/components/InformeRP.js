import React, { useMemo, useState } from 'react';
import {
  Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody,
  IconButton, Collapse, Box
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

const normalizarTexto = (texto) =>
  texto?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const InformeRP = ({ datos, mapaContratistas = {} }) => {
  const [abiertos, setAbiertos] = useState({});

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

  const toggleRP = (rp) => {
    setAbiertos((prev) => ({ ...prev, [rp]: !prev[rp] }));
  };

  if (!resumenRP.length) return null;

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Resumen por RP
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell><strong>RP</strong></TableCell>
            <TableCell><strong>Contratista(s)</strong></TableCell>
            <TableCell><strong>Registros</strong></TableCell>
            <TableCell><strong>Total ($)</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {resumenRP.map((rp) => (
            <React.Fragment key={rp.RP}>
              <TableRow>
                <TableCell>
                  <IconButton size="small" onClick={() => toggleRP(rp.RP)}>
                    {abiertos[rp.RP] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                  </IconButton>
                </TableCell>
                <TableCell>{rp.RP}</TableCell>
                <TableCell>
                  {mapaContratistas[rp.RP]
                    ? mapaContratistas[rp.RP].map((c, i) => c.Nombre).join(', ')
                    : 'No encontrado'}
                </TableCell>
                <TableCell>{rp.cantidad}</TableCell>
                <TableCell>${rp.total.toLocaleString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={5} sx={{ p: 0 }}>
                  <Collapse in={abiertos[rp.RP]} timeout="auto" unmountOnExit>
                    <Box sx={{ margin: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Detalle de contratistas
                      </Typography>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Objeto</TableCell>
                            <TableCell>Valor ($)</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {(mapaContratistas[rp.RP] || []).map((c, index) => (
                            <TableRow key={index}>
                              <TableCell>{c.Nombre}</TableCell>
                              <TableCell>{c.Objeto}</TableCell>
                              <TableCell>${(c.Valor || 0).toLocaleString()}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default InformeRP;