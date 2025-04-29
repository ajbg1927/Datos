import React from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const SelectorDeCuadro = ({ cuadros = [], seleccionarCuadro, cuadroSeleccionado }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>Selecciona un Cuadro</Typography>
      <FormControl fullWidth>
        <InputLabel id="selector-cuadro-label">Cuadro</InputLabel>
        <Select
          labelId="selector-cuadro-label"
          value={cuadroSeleccionado || ''}
          label="Cuadro"
          onChange={(e) => seleccionarCuadro(e.target.value)}
        >
          {Array.isArray(cuadros) && cuadros.length > 0 ? (
            cuadros.map((cuadro, index) => (
              <MenuItem key={index} value={cuadro}>
                {cuadro}
              </MenuItem>
            ))
          ) : (
            <MenuItem value="" disabled>
              No hay cuadros disponibles
            </MenuItem>
          )}
        </Select>
      </FormControl>
    </Box>
  );
};

export default SelectorDeCuadro;