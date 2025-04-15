import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';

const TablaHojas = ({ hojas, hojaSeleccionada, onHojaChange }) => {
  return (
    <Box sx={{ mb: 3 }}>
      <FormControl fullWidth variant="outlined" sx={{ backgroundColor: '#fff' }}>
        <InputLabel sx={{ color: '#000' }}>Selecciona una hoja</InputLabel>
        <Select
          value={hojaSeleccionada || ''}
          label="Selecciona una hoja"
          onChange={(e) => onHojaChange(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#ffcd00',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#e6b800',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#00c853',
            },
          }}
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
