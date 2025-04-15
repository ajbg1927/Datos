import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';

const TablaArchivos = ({ archivos, archivoSeleccionado, onArchivoChange }) => {
  return (
    <Box sx={{ mb: 3 }}>
      <FormControl fullWidth variant="outlined" sx={{ backgroundColor: '#fff' }}>
        <InputLabel sx={{ color: '#000' }}>Selecciona un archivo</InputLabel>
        <Select
          value={archivoSeleccionado || ''}
          label="Selecciona un archivo"
          onChange={(e) => onArchivoChange(e.target.value)}
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

