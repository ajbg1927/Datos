import React from 'react';
import { FormGroup, FormControlLabel, Checkbox, Typography } from '@mui/material';

const SelectorHojas = ({ hojas, hojasSeleccionadas, setHojasSeleccionadas }) => {
  const handleCheckboxChange = (event) => {
    const hoja = event.target.name;
    if (event.target.checked) {
      setHojasSeleccionadas((prev) => [...prev, hoja]);
    } else {
      setHojasSeleccionadas((prev) => prev.filter((h) => h !== hoja));
    }
  };

  return (
    <div>
      <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
        Selecciona las hojas a combinar:
      </Typography>
      <FormGroup row>
        {hojas.map((hoja) => (
          <FormControlLabel
            key={hoja}
            control={
              <Checkbox
                checked={hojasSeleccionadas.includes(hoja)}
                onChange={handleCheckboxChange}
                name={hoja}
              />
            }
            label={hoja}
          />
        ))}
      </FormGroup>
    </div>
  );
};

export default SelectorHojas;
