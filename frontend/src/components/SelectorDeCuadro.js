import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const SelectorDeCuadro = ({ cuadros, seleccionarCuadro, cuadroSeleccionado }) => {
  const handleChange = (event) => {
    seleccionarCuadro(event.target.value);
  };

  return (
    <FormControl fullWidth sx={{ mt: 2 }}>
      <InputLabel>Seleccionar Cuadro</InputLabel>
      <Select
        value={cuadroSeleccionado !== null ? cuadroSeleccionado : ''}
        onChange={handleChange}
        label="Seleccionar Cuadro"
      >
        {cuadros.map((cuadro, index) => (
          <MenuItem key={index} value={index}>
            Cuadro {index + 1}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectorDeCuadro;