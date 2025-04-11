import React from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const TablaHojas = ({ hojas, hojaSeleccionada, handleHojaChange }) => {
  return (
    <Box m={2} width="300px">
      <FormControl fullWidth>
        <InputLabel>Seleccionar hoja</InputLabel>
        <Select value={hojaSeleccionada} onChange={handleHojaChange}>
          {hojas.map((hoja) => (
            <MenuItem key={hoja} value={hoja}>
              {hoja}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default TablaHojas;