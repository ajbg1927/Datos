import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';

const TablaHojas = ({ hojas = [], hojaSeleccionada, onHojaChange }) => {
  return (
    <Box sx={{ mb: 3 }}>
      <FormControl fullWidth variant="outlined" sx={{ backgroundColor: '#f5f5f5' }}>
        <InputLabel sx={{ color: '#000' }}>Selecciona una hoja</InputLabel>
        <Select
          value={hojaSeleccionada || ''}
          label="Selecciona una hoja"
          onChange={(e) => onHojaChange(e.target.value)}
          displayEmpty
          sx={{
            backgroundColor: '#f5f5f5',
            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#cfd8dc' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#43a047' },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#43a047' },
          }}
        >
          {hojas.length === 0 ? (
            <MenuItem disabled value="">
              No hay hojas disponibles
            </MenuItem>
          ) : (
            hojas.map((hoja, index) => (
              <MenuItem
                key={index}
                value={hoja}
                sx={{
                  color: '#37474f',
                  '&:hover': {
                    backgroundColor: '#dcedc8',
                  },
                }}
              >
                {hoja}
              </MenuItem>
            ))
          )}
        </Select>
      </FormControl>
    </Box>
  );
};

export default TablaHojas;
