import React, { useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
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
  Legend,
  ResponsiveContainer,
} from 'recharts';

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

  useEffect(() => {
    if (!datos || !columnaAgrupacion || !columnaValor) return;

    const agrupado = {};
    datos.forEach((fila) => {
      const clave = fila[columnaAgrupacion];
      const valor = parseFloat(fila[columnaValor]) || 0;
      agrupado[clave] = (agrupado[clave] || 0) + valor;
    });

    const nuevoData = Object.entries(agrupado).map(([key, value]) => ({
      name: key,
      value,
    }));

    setDataAgrupada(nuevoData);
  }, [datos, columnaAgrupacion, columnaValor]);

  const coloresUsar = PALETAS[paleta] || PALETAS['Institucional'];

  return (
    <Box mt={4}>
      <Typography variant="h5" gutterBottom align="center">
        Gráfico por {columnaAgrupacion} - Total de {columnaValor}
      </Typography>

      <Box sx={{ mb: 2 }}>
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
      </Box>

      <Box sx={{ mb: 3 }}>
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
      </Box>

      <Box sx={{ display: 'flex', flexDirection: tipoGrafico === 'Ambos' ? 'row' : 'column', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
        {(tipoGrafico === 'Barras' || tipoGrafico === 'Ambos') && (
          <ResponsiveContainer width={tipoGrafico === 'Ambos' ? 500 : '100%'} height={400}>
            <BarChart data={dataAgrupada}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill={coloresUsar[0]} />
            </BarChart>
          </ResponsiveContainer>
        )}

        {(tipoGrafico === 'Pastel' || tipoGrafico === 'Ambos') && (
          <ResponsiveContainer width={tipoGrafico === 'Ambos' ? 400 : '100%'} height={400}>
            <PieChart>
              <Pie
                data={dataAgrupada}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={130}
                label
              >
                {dataAgrupada.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={coloresUsar[index % coloresUsar.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </Box>
    </Box>
  );
};

export default Graficos;