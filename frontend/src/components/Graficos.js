import React, { useMemo } from 'react';
import {
  Box,
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
  ResponsiveContainer,
  LabelList,
} from 'recharts';
import InsertChartIcon from '@mui/icons-material/InsertChart';

const PALETAS = {
  Institucional: ['#4caf50', '#fdd835', '#ff9800', '#2196f3', '#9c27b0', '#ff5722'],
  Pastel: ['#ffd1dc', '#bae1ff', '#caffbf', '#fdffb6', '#a0c4ff', '#ffc6ff'],
  Fuego: ['#ff5722', '#ff7043', '#ff8a65', '#ffab91', '#d84315', '#bf360c'],
  Frío: ['#00bcd4', '#4dd0e1', '#80deea', '#b2ebf2', '#e0f7fa', '#006064'],
  Oceano: ['#034078', '#05668D', '#028090', '#00A896', '#02C8A9'],
};

const Graficos = ({
  datosAgrupados,
  columnaAgrupacion,
  columnaValor,
  tipoGrafico,
  paleta,
  ordenar,
  topN,
  mostrarPorcentajeBarras,
}) => {
  const dataAgrupada = useMemo(() => {
    if (!Array.isArray(datosAgrupados)) return [];

    let nuevaData = [...datosAgrupados];

    if (ordenar) {
      nuevaData.sort((a, b) => b.valor - a.valor);
    }

    if (topN > 0 && topN < nuevaData.length) {
      nuevaData = nuevaData.slice(0, topN);
    }

    return nuevaData;
  }, [datosAgrupados, ordenar, topN]);

  const coloresUsar = PALETAS[paleta] || PALETAS['Institucional'];
  const total = useMemo(() => dataAgrupada.reduce((acc, cur) => acc + cur.valor, 0), [dataAgrupada]);

  if (!dataAgrupada.length) {
    return (
      <Typography variant="body1" color="text.secondary" align="center" mt={5}>
        No hay datos suficientes para mostrar el gráfico.
      </Typography>
    );
  }

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
        Análisis por <strong>{columnaAgrupacion}</strong> — Total de <strong>{columnaValor}</strong>
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gap: 4,
          gridTemplateColumns: {
            xs: '1fr',
            md: tipoGrafico === 'Ambos' ? '1fr 1fr' : '1fr',
          },
        }}
      >
        {(tipoGrafico === 'Barras' || tipoGrafico === 'Ambos') && (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={dataAgrupada}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nombre" />
              <YAxis />
              <Tooltip
                formatter={(value = 0) => [`${value.toLocaleString()} (${((value / total) * 100).toFixed(1)}%)`]}
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #ccc',
                  fontSize: '0.85rem',
                }}
              />
              <Bar
                dataKey="valor"
                fill={coloresUsar[0]}
                animationDuration={1500}
                animationEasing="ease-out"
              >
                <LabelList
                  dataKey="valor"
                  position="top"
                  formatter={(value) =>
                    mostrarPorcentajeBarras
                      ? `${((value / total) * 100).toFixed(1)}%`
                      : value.toLocaleString()
                  }
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}

        {(tipoGrafico === 'Pastel' || tipoGrafico === 'Ambos') && (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={dataAgrupada}
                dataKey="valor"
                nameKey="nombre"
                cx="50%"
                cy="50%"
                outerRadius={130}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
                animationDuration={1500}
                animationEasing="ease-out"
              >
                {dataAgrupada.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={coloresUsar[index % coloresUsar.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value = 0) => `${value.toLocaleString()} (${((value / total) * 100).toFixed(1)}%)`}
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
    </Box>
  );
};

export default Graficos;