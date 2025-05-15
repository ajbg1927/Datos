import React from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';
import useInformePresupuestal from '../hooks/useInformePresupuestal';

const InformePresupuestal = ({ datos }) => {
  const informe = useInformePresupuestal(datos);

  if (!informe) {
    return (
      <Paper sx={{ p: 3, my: 3 }}>
        <Typography variant="body1">No hay datos presupuestales detectados.</Typography>
      </Paper>
    );
  }

  const { resumen, claves } = informe;

  return (
    <Paper sx={{ p: 3, my: 3 }}>
      <Typography variant="h6" gutterBottom>Resumen Presupuestal</Typography>
      <Grid container spacing={2}>
        {Object.entries(resumen).map(([clave, valor]) => (
          <Grid item xs={6} md={4} key={clave}>
            <Typography>
              <strong>{clave.replace('total', '')}:</strong> {valor.toLocaleString('es-CO')}
            </Typography>
          </Grid>
        ))}
      </Grid>
      <Box mt={2}>
        <Typography variant="caption" color="textSecondary">
          Columnas detectadas: {Object.entries(claves).map(([k, v]) => `${k}: ${v}`).join(', ')}
        </Typography>
      </Box>
    </Paper>
  );
};

export default InformePresupuestal;