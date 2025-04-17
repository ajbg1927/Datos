import React from 'react';
import { Box, Card, CardContent, Typography, useTheme, Grid } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const COLORS = ['#4caf50', '#fdd835', '#ff9800', '#2196f3', '#9c27b0', '#ff5722'];

const Graficos = ({ datos, columnaAgrupar, columnaValor }) => {
  const theme = useTheme();

  const datosAgrupados = React.useMemo(() => {
    if (!columnaAgrupar || !columnaValor) return [];
    const mapa = {};
    datos.forEach((fila) => {
      const clave = fila[columnaAgrupar];
      const valor = parseFloat(fila[columnaValor]) || 0;
      if (!mapa[clave]) {
        mapa[clave] = valor;
      } else {
        mapa[clave] += valor;
      }
    });
    return Object.entries(mapa).map(([clave, valor]) => ({
      nombre: clave,
      valor: valor,
    }));
  }, [datos, columnaAgrupar, columnaValor]);

  if (!columnaAgrupar || !columnaValor || datosAgrupados.length === 0) return null;

  return (
    <Box sx={{ mt: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', p: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Gráfico por {columnaAgrupar}
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={datosAgrupados}
                    dataKey="valor"
                    nameKey="nombre"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label
                  >
                    {datosAgrupados.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', p: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Gráfico de barras
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={datosAgrupados}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nombre" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="valor" fill={theme.palette.primary.main} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Graficos;