import React from 'react';
import { Box, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const colores = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00c49f', '#0088fe'];

const Graficos = ({ datos, campoX, campoY }) => {
  if (!campoX || !campoY || datos.length === 0) return null;

  return (
    <Box m={4}>
      <Typography variant="h6" gutterBottom>Gráfico de Barras</Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={datos}>
          <XAxis dataKey={campoX} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey={campoY} fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>

      <Typography variant="h6" gutterBottom mt={4}>Gráfico de Pastel</Typography>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={datos}
            dataKey={campoY}
            nameKey={campoX}
            outerRadius={120}
            fill="#82ca9d"
            label
          >
            {datos.map((_, index) => (
              <Cell key={index} fill={colores[index % colores.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default Graficos;