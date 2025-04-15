import React, { useState, useMemo, useRef } from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Grid,
  Paper,
  Button,
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
  CartesianGrid,
} from 'recharts';
import html2canvas from 'html2canvas';
import useGraficos from '../hooks/useGraficos'; // ✅ Asegúrate de que la ruta sea correcta

const colores = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00c49f', '#0088fe'];

const Graficos = ({ datos = [] }) => {
  const [campoX, setCampoX] = useState('');
  const [campoY, setCampoY] = useState('');
  const chartRef = useRef();

  const columnasNumericas = useMemo(() => {
    if (!datos.length) return [];
    const ejemplo = datos[0];
    return Object.keys(ejemplo).filter(
      key => typeof ejemplo[key] === 'number' || !isNaN(parseFloat(ejemplo[key]))
    );
  }, [datos]);

  const columnasTextuales = useMemo(() => {
    if (!datos.length) return [];
    const ejemplo = datos[0];
    return Object.keys(ejemplo).filter(
      key => typeof ejemplo[key] === 'string' && ejemplo[key].length < 100
    );
  }, [datos]);

  // ✅ Usamos el hook para agrupar datos
  const datosAgrupados = useGraficos(datos, campoX, campoY);

  const handleDownload = () => {
    if (chartRef.current) {
      html2canvas(chartRef.current).then((canvas) => {
        const link = document.createElement('a');
        link.download = 'grafico.png';
        link.href = canvas.toDataURL();
        link.click();
      });
    }
  };

  if (!datos.length) {
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
        <Box>
          <Box ref={chartRef}>
            <Typography variant="h6" gutterBottom>
              Gráfico de Barras
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={datosAgrupados} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nombre" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="valor" fill="#1976d2" />
              </BarChart>
            </ResponsiveContainer>

            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
              Gráfico de Pastel
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={datosAgrupados}
                  dataKey="valor"
                  nameKey="nombre"
                  outerRadius={120}
                  label
                >
                  {datosAgrupados.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={colores[index % colores.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button variant="outlined" color="secondary" onClick={handleDownload}>
              Descargar gráfico como PNG
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Graficos;