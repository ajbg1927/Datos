import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
  Paper,
} from '@mui/material';

const SelectoresAgrupacion = ({
  columnas,
  columnaAgrupar,
  setColumnaAgrupar,
  columnaValor,
  setColumnaValor,
}) => {
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
      <Typography variant="h6" fontWeight="bold" sx={{ color: '#388E3C', mb: 2 }}>
        Visualización de Gráficos
      </Typography>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={3}
        justifyContent="flex-start"
      >
        <FormControl fullWidth>
          <InputLabel sx={{ color: '#388E3C' }}>Agrupar por</InputLabel>
          <Select
            value={columnaAgrupar}
            label="Agrupar por"
            onChange={(e) => setColumnaAgrupar(e.target.value)}
            sx={{ bgcolor: 'white' }}
          >
            {columnas.map((col, i) => (
              <MenuItem key={i} value={col}>
                {col}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel sx={{ color: '#388E3C' }}>Columna de valor</InputLabel>
          <Select
            value={columnaValor}
            label="Columna de valor"
            onChange={(e) => setColumnaValor(e.target.value)}
            sx={{ bgcolor: 'white' }}
          >
            {columnas.map((col, i) => (
              <MenuItem key={i} value={col}>
                {col}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    </Paper>
  );
};

export default SelectoresAgrupacion;