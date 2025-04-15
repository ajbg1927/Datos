import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';

const TablaHojas = ({ hojas, hojaSeleccionada, onHojaChange }) => {
  return (
    <Box sx={{ mb: 2 }}>
      <FormControl fullWidth>
        <InputLabel>Selecciona una hoja</InputLabel>
        <Select
          value={hojaSeleccionada || ''}
          label="Selecciona una hoja"
          onChange={(e) => onHojaChange(e.target.value)}
        >
          {hojas.map((hoja, index) => (
            <MenuItem key={index} value={hoja}>
              {hoja}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default TablaHojas;
