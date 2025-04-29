import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Paper,
} from '@mui/material';

const SelectorColumnas = ({
  columnas,
  columnaAgrupar,
  setColumnaAgrupar,
  columnaValor,
  setColumnaValor,
}) => {
  if (!columnas || columnas.length === 0) return null;

  return (
    <Paper elevation={4} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, color: '#2e7d32' }}>
        Configuración del gráfico
      </Typography>
      <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
        <FormControl fullWidth>
          <InputLabel id="agrupacion-label">Agrupar por</InputLabel>
          <Select
            labelId="agrupacion-label"
            value={columnaAgrupar}
            label="Agrupar por"
            onChange={(e) => setColumnaAgrupar(e.target.value)}
          >
            {columnas.map((col) => (
              <MenuItem key={col} value={col}>
                {col}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="valor-label">Columna de valores</InputLabel>
          <Select
            labelId="valor-label"
            value={columnaValor}
            label="Columna de valores"
            onChange={(e) => setColumnaValor(e.target.value)}
          >
            {columnas.map((col) => (
              <MenuItem key={col} value={col}>
                {col}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Paper>
  );
};

export default SelectorColumnas;