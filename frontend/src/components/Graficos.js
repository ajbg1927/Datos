import React, { useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  TextField,
  Grid,
  Button,
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from 'recharts';
import InsertChartIcon from '@mui/icons-material/InsertChart';

const PALETAS = {
  Institucional: ['#4caf50', '#fdd835', '#ff9800', '#2196f3', '#9c27b0', '#ff5722'],
  Pastel: ['#ffd1dc', '#bae1ff', '#caffbf', '#fdffb6', '#a0c4ff', '#ffc6ff'],
  Fuego: ['#ff5722', '#ff7043', '#ff8a65', '#ffab91', '#d84315', '#bf360c'],
  Frío: ['#00bcd4', '#4dd0e1', '#80deea', '#b2ebf2', '#e0f7fa', '#006064'],
};

const Graficos = ({ datos, columnaAgrupacion, columnaValor }) => {
  const [tipoGrafico, setTipoGrafico] = useState('Barras');
  const [paleta, setPaleta] = useState('Institucional');
  const [dataAgrupada, setDataAgrupada] = useState([]);
  const [ordenar, setOrdenar] = useState(true);
  const [topN, setTopN] = useState(10);

  useEffect(() => {
    if (!datos || !columnaAgrupacion || !columnaValor) return;

    const agrupado = {};
    datos.forEach((fila) => {
      const clave = fila[columnaAgrupacion];
      const valor = parseFloat(fila[columnaValor]) || 0;
      if (clave) agrupado[clave] = (agrupado[clave] || 0) + valor;
    });

    let nuevoData = Object.entries(agrupado).map(([key, value]) => ({
      name: key,
      value,
    }));

    if (ordenar) {
      nuevoData.sort((a, b) => b.value - a.value);
    }

    if (topN > 0 && topN < nuevoData.length) {
      nuevoData = nuevoData.slice(0, topN);
    }

    setDataAgrupada(nuevoData);
  }, [datos, columnaAgrupacion, columnaValor, ordenar, topN]);

  const coloresUsar = PALETAS[paleta] || PALETAS['Institucional'];

  return (
    <Box mt={4}>
      <Typography
        variant="h6"
        sx={{
          mb: 3,
          fontWeight: 'bold',
          textAlign: 'center',
          color: '#2e7d32',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
        }}
      >
        <InsertChartIcon fontSize="medium" />
        Análisis por <strong>&nbsp;{columnaAgrupacion}</strong> — Total de <strong>&nbsp;{columnaValor}</strong>
      </Typography>

      <Box
        sx={{
          mb: 3,
          p: 2,
          borderRadius: 2,
          bgcolor: '#fafafa',
          boxShadow: '0px 1px 4px rgba(0,0,0,0.1)',
        }}
      >
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold', color: 'gray' }}>
          Configuración del gráfico
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel id="tipo-grafico-label">Tipo de gráfico</InputLabel>
              <Select
                labelId="tipo-grafico-label"
                value={tipoGrafico}
                label="Tipo de gráfico"
                onChange={(e) => setTipoGrafico(e.target.value)}
              >
                <MenuItem value="Barras">Barras</MenuItem>
                <MenuItem value="Pastel">Pastel</MenuItem>
                <MenuItem value="Ambos">Ambos</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel id="paleta-color-label">Paleta de colores</InputLabel>
              <Select
                labelId="paleta-color-label"
                value={paleta}
                label="Paleta de colores"
                onChange={(e) => setPaleta(e.target.value)}
              >
                {Object.keys(PALETAS).map((key) => (
                  <MenuItem key={key} value={key}>
                    {key}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6} sm={2}>
            <TextField
              fullWidth
              type="number"
              label="Top N"
              value={topN}
              onChange={(e) => setTopN(parseInt(e.target.value) || 0)}
              inputProps={{ min: 1 }}
            />
          </Grid>

          <Grid item xs={6} sm={2}>
            <FormControl fullWidth>
              <InputLabel id="ordenar-label">Ordenar</InputLabel>
              <Select
                labelId="ordenar-label"
                value={ordenar ? 'Sí' : 'No'}
                label="Ordenar"
                onChange={(e) => setOrdenar(e.target.value === 'Sí')}
              >
                <MenuItem value="Sí">Sí</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {dataAgrupada.length === 0 ? (
        <Typography variant="body1" color="text.secondary" align="center" mt={5}>
          No hay datos suficientes para mostrar el gráfico.
        </Typography>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gap: 4,
            gridTemplateColumns: {
              xs: '1fr',
              md: tipoGrafico === 'Ambos' ? '1fr 1fr' : '1fr',
            },
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {(tipoGrafico === 'Barras' || tipoGrafico === 'Ambos') && (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={dataAgrupada}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #ccc',
                    fontSize: '0.85rem',
                  }}
                />
                <Bar
                  dataKey="value"
                  fill={coloresUsar[0]}
                  animationDuration={1000}
                >
                  <LabelList dataKey="value" position="top" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}

          {(tipoGrafico === 'Pastel' || tipoGrafico === 'Ambos') && (
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={dataAgrupada}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={130}
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(1)}%)`
                  }
                  animationDuration={1000}
                >
                  {dataAgrupada.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={coloresUsar[index % coloresUsar.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #ccc',
                    fontSize: '0.85rem',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Graficos;