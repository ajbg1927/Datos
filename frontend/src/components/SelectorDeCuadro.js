import React from 'react';
import { Box, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const SelectorDeCuadro = ({ cuadros, cuadroSeleccionado, setCuadroSeleccionado }) => {
  return (
    <Box sx={{ mb: 3 }}>
      <FormControl fullWidth>
        <InputLabel id="selector-cuadro-label">Selecciona un cuadro</InputLabel>
        <Select
          labelId="selector-cuadro-label"
          value={cuadroSeleccionado}
          label="Selecciona un cuadro"
          onChange={(e) => setCuadroSeleccionado(Number(e.target.value))}
        >
          {cuadros.map((_, idx) => (
            <MenuItem key={idx} value={idx}>
              Cuadro {idx + 1}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {cuadros.length === 0 && (
        <Typography variant="body2" color="text.secondary" mt={2}>
          No se detectaron cuadros en esta hoja.
        </Typography>
      )}
    </Box>
  );
};

export default SelectorDeCuadro;