import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  useTheme,
} from '@mui/material';
import PaidIcon from '@mui/icons-material/Paid';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ShowChartIcon from '@mui/icons-material/ShowChart';

const calcularMediana = (valores) => {
  if (valores.length === 0) return 0;
  const sorted = [...valores].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
};

const getIconForMetric = (tipo) => {
  switch (tipo) {
    case 'total': return <PaidIcon />;
    case 'promedio': return <AccountBalanceIcon />;
    case 'min': return <TrendingDownIcon />;
    case 'max': return <TrendingUpIcon />;
    case 'mediana': return <ShowChartIcon />;
    case 'conteo': return <AssessmentIcon />;
    default: return <AssessmentIcon />;
  }
};

const getColorForMetric = (tipo) => {
  switch (tipo) {
    case 'total': return '#4caf50';
    case 'promedio': return '#2196f3';
    case 'min': return '#e53935';
    case 'max': return '#43a047';
    case 'mediana': return '#ff9800';
    case 'conteo': return '#9c27b0';
    default: return '#607d8b';
  }
};

const ResumenGeneral = React.memo(({ datos, columnaValor, resultadosProcesados }) => {
  if (!datos || datos.length === 0 || !columnaValor) return null; 

  const theme = useTheme();
  const formatter = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  });

  const metricas = (columnaValor || []).flatMap((columna) => { 
    const valoresNumericos = datos
      .map((fila) => parseFloat(fila[columna]))
      .filter((val) => !isNaN(val));

    const total = valoresNumericos.reduce((acc, val) => acc + val, 0);
    const promedio = total / valoresNumericos.length || 0;
    const min = Math.min(...valoresNumericos);
    const max = Math.max(...valoresNumericos);
    const mediana = calcularMediana(valoresNumericos);
    const conteo = valoresNumericos.length;

    return [
      { tipo: 'conteo', label: `# Registros de ${columna}`, valor: conteo },
      { tipo: 'total', label: `Total ${columna}`, valor: total, esMoneda: true },
      { tipo: 'promedio', label: `Promedio ${columna}`, valor: promedio, esMoneda: true },
      { tipo: 'min', label: `Mínimo ${columna}`, valor: min, esMoneda: true },
      { tipo: 'max', label: `Máximo ${columna}`, valor: max, esMoneda: true },
      { tipo: 'mediana', label: `Mediana ${columna}`, valor: mediana, esMoneda: true },
    ];
  });

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Resumen general
      </Typography>

      <Grid container spacing={3}>
        {metricas.map((metrica, idx) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
            <Card
              sx={{
                backgroundColor: theme.palette.background.paper,
                borderLeft: `6px solid ${getColorForMetric(metrica.tipo)}`,
                height: '100%',
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Box
                    sx={{
                      fontSize: 40,
                      color: getColorForMetric(metrica.tipo),
                      mr: 2,
                    }}
                  >
                    {getIconForMetric(metrica.tipo)}
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">{metrica.label}</Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {metrica.esMoneda
                        ? formatter.format(metrica.valor)
                        : metrica.valor}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
});

export default ResumenGeneral;