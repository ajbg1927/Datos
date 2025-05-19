import React from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';
import useInformePresupuestal from '../hooks/useInformePresupuestal';
import TablaDatos from './TablaDatos';

const InformePresupuestal = ({ datos, datosContratistas = [] }) => {
  const informe = useInformePresupuestal(datos, datosContratistas);

  if (!informe) {
    return (
      <Paper sx={{ p: 3, my: 3 }}>
        <Typography variant="body1">No hay datos presupuestales detectados.</Typography>
      </Paper>
    );
  }

  const { resumen, claves, vinculaciones } = informe;

  return (
    <Paper sx={{ p: 3, my: 3 }}>
      <Typography variant="h6" gutterBottom>
        Resumen Presupuestal
      </Typography>

      <Grid container spacing={2}>
        {Object.entries(resumen).map(([clave, valor]) => (
          <Grid item xs={6} md={4} key={clave}>
            <Typography>
              <strong>{clave.replace('total', '')}:</strong>{' '}
              {typeof valor === 'number' ? valor.toLocaleString('es-CO') : valor}
            </Typography>
          </Grid>
        ))}
      </Grid>

      <Box mt={2}>
        <Typography variant="caption" color="textSecondary">
          Columnas detectadas:{' '}
          {Object.entries(claves)
            .map(([k, v]) => `${k}: ${v}`)
            .join(', ')}
        </Typography>
      </Box>

      {vinculaciones && Object.keys(vinculaciones).length > 0 && (
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            Contratistas Vinculados por RP
          </Typography>
          {Object.entries(vinculaciones).map(([rp, lista]) => (
            <Paper key={rp} sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                <strong>RP:</strong> {rp}
              </Typography>
              <TablaDatos datosIniciales={lista} columnasDefinidas={Object.keys(lista[0])} />
            </Paper>
          ))}
        </Box>
      )}
    </Paper>
  );
};

export default InformePresupuestal;