import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';

const TablaArchivos = ({ archivos, archivoSeleccionado, onArchivoChange }) => {
  return (
    <Box sx={{ mb: 2 }}>
      <FormControl fullWidth>
        <InputLabel>Selecciona un archivo</InputLabel>
        <Select
          value={archivoSeleccionado || ''}
          label="Selecciona un archivo"
          onChange={(e) => onArchivoChange(e.target.value)}
        >
          {archivos.map((archivo, index) => (
            <MenuItem key={index} value={archivo}>
              {archivo}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default TablaArchivos;
