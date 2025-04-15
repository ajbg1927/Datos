import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';

const TablaArchivos = ({ archivos = [], archivoSeleccionado, onArchivoChange }) => {
  return (
    <Box sx={{ mb: 3 }}>
      <FormControl fullWidth variant="outlined" sx={{ backgroundColor: '#f5f5f5' }}>
        <InputLabel sx={{ color: '#000' }}>Selecciona un archivo</InputLabel>
        <Select
          value={archivoSeleccionado || ''}
          label="Selecciona un archivo"
          onChange={(e) => onArchivoChange(e.target.value)}
          displayEmpty
          sx={{
            backgroundColor: '#f5f5f5',
            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#cfd8dc' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#43a047' },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#43a047' },
          }}
        >
          {archivos.length === 0 ? (
            <MenuItem disabled value="">
              No hay archivos disponibles
            </MenuItem>
          ) : (
            archivos.map((archivo, index) => (
              <MenuItem
                key={index}
                value={archivo}
                sx={{
                  color: '#37474f',
                  '&:hover': {
                    backgroundColor: '#dcedc8',
                  },
                }}
              >
                {archivo}
              </MenuItem>
            ))
          )}
        </Select>
      </FormControl>
    </Box>
  );
};

export default TablaArchivos;
