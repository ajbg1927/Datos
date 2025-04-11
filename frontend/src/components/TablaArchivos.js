import React from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const TablaArchivos = ({ archivos, archivoSeleccionado, handleArchivoChange }) => {
  return (
    <Box m={2} width="300px">
      <FormControl fullWidth>
        <InputLabel>Seleccionar archivo</InputLabel>
        <Select value={archivoSeleccionado} onChange={handleArchivoChange}>
          {archivos.map((archivo) => (
            <MenuItem key={archivo} value={archivo}>
              {archivo}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default TablaArchivos;