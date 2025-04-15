import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Grid,
  Paper,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const colores = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00c49f', '#0088fe'];

const Graficos = ({ datos = [] }) => {
  const [campoX, setCampoX] = useState('');
  const [campoY, setCampoY] = useState('');

  const columnasNumericas = useMemo(() => {
    if (!datos || datos.length === 0) return [];
    const ejemplo = datos[0];
    return Object.keys(ejemplo).filter(
      key => typeof ejemplo[key] === 'number' || !isNaN(parseFloat(ejemplo[key]))
    );
  }, [datos]);

  const columnasTextuales = useMemo(() => {
    if (!datos || datos.length === 0) return [];
    const ejemplo = datos[0];
    return Object.keys(ejemplo).filter(
      key => typeof ejemplo[key] === 'string' && ejemplo[key].length < 100
    );
  }, [datos]);

  const datosAgrupados = useMemo(() => {
    if (!campoX || !campoY || datos.length === 0) return [];
    const agrupados = {};
    datos.forEach(item => {
      const clave = item[campoX];
      const valor = parseFloat(item[campoY]) || 0;
      if (clave) {
        agrupados[clave] = (agrupados[clave] || 0) + valor;
      }
    });
    return Object.entries(agrupados).map(([key, value]) => ({
      [campoX]: key,
      [campoY]: value,
    }));
  }, [campoX, campoY, datos]);

  if (!datos || datos.length === 0) {
    return (
      <Box m={4}>
        <Typography variant="h6" color="text.secondary">
          No hay datos disponibles para graficar.
        </Typography>
      </Box>
    );
  }

  return (
    <Box m={4}>
      <Typography variant="h5" gutterBottom fontWeight={600}>
        Visualización de Gráficos
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Columna de Agrupación</InputLabel>
              <Select
                value={campoX}
                label="Columna de Agrupación"
                onChange={(e) => setCampoX(e.target.value)}
              >
                {columnasTextuales.map((col) => (
                  <MenuItem key={col} value={col}>
                    {col}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Columna de Valores</InputLabel>
              <Select
                value={campoY}
                label="Columna de Valores"
                onChange={(e) => setCampoY(e.target.value)}
              >
                {columnasNumericas.map((col) => (
                  <MenuItem key={col} value={col}>
                    {col}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {campoX && campoY && datosAgrupados.length > 0 && (
        <>
          <Typography variant="h6" gutterBottom>
            Gráfico de Barras
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={datosAgrupados}>
              <XAxis dataKey={campoX} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={campoY} fill="#1976d2" />
            </BarChart>
          </ResponsiveContainer>

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Gráfico de Pastel
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={datosAgrupados}
                dataKey={campoY}
                nameKey={campoX}
                outerRadius={120}
                label
              >
                {datosAgrupados.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colores[index % colores.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </>
      )}
    </Box>
  );
};

export default Graficos;
