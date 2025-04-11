import React from 'react';
import { FormGroup, FormControlLabel, Checkbox, Box } from '@mui/material';

const ColumnSelector = ({ columnas, columnasVisibles, setColumnasVisibles }) => {
  const toggleColumna = (col) => {
    const nuevas = columnasVisibles.includes(col)
      ? columnasVisibles.filter(c => c !== col)
      : [...columnasVisibles, col];
    setColumnasVisibles(nuevas);
  };

  return (
    <Box m={2}>
      <FormGroup row>
        {columnas.map((col) => (
          <FormControlLabel
            key={col}
            control={
              <Checkbox
                checked={columnasVisibles.includes(col)}
                onChange={() => toggleColumna(col)}
              />
            }
            label={col}
          />
        ))}
      </FormGroup>
    </Box>
  );
};

export default ColumnSelector;