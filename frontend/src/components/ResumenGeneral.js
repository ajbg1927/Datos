import React from 'react';
import { Box, Grid, Card, CardContent, Typography } from '@mui/material';
import PaidIcon from '@mui/icons-material/Paid';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AssessmentIcon from '@mui/icons-material/Assessment';

const ResumenGeneral = ({ datos, columnaValor }) => {
  if (!datos || datos.length === 0 || !columnaValor) return null;

  const totalRegistros = datos.length;
  const totalValor = datos.reduce((acc, fila) => acc + (parseFloat(fila[columnaValor]) || 0), 0);

  const formatter = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  });

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Resumen general
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ backgroundColor: '#f5f5f5', borderLeft: '6px solid #4caf50' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <AssessmentIcon sx={{ fontSize: 40, color: '#4caf50', mr: 2 }} />
                <Box>
                  <Typography variant="subtitle2">Total registros</Typography>
                  <Typography variant="h6" fontWeight="bold">{totalRegistros}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ backgroundColor: '#f5f5f5', borderLeft: '6px solid #fdd835' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <PaidIcon sx={{ fontSize: 40, color: '#fdd835', mr: 2 }} />
                <Box>
                  <Typography variant="subtitle2">Total {columnaValor}</Typography>
                  <Typography variant="h6" fontWeight="bold">{formatter.format(totalValor)}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ backgroundColor: '#f5f5f5', borderLeft: '6px solid #2196f3' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <AccountBalanceIcon sx={{ fontSize: 40, color: '#2196f3', mr: 2 }} />
                <Box>
                  <Typography variant="subtitle2">Valor promedio</Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {formatter.format(totalValor / totalRegistros || 0)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ResumenGeneral;