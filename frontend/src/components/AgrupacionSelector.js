import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';

const AgrupacionSeleccion = ({
  columnas,
  columnaAgrupar,
  setColumnaAgrupar,
  columnaValor,
  setColumnaValor,
}) => {
  return (
    <Box sx={{ my: 3 }}>
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
        Opciones de visualización
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
        <FormControl fullWidth>
          <InputLabel>Agrupar por</InputLabel>
          <Select
            value={columnaAgrupar}
            label="Agrupar por"
            onChange={(e) => setColumnaAgrupar(e.target.value)}
          >
            {columnas.map((col, i) => (
              <MenuItem key={i} value={col}>
                {col}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Columna de valor</InputLabel>
          <Select
            value={columnaValor}
            label="Columna de valor"
            onChange={(e) => setColumnaValor(e.target.value)}
          >
            {columnas.map((col, i) => (
              <MenuItem key={i} value={col}>
                {col}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    </Box>
  );
};

export default AgrupacionSeleccion;