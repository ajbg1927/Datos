import React from 'react';
import {
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Paper,
  Typography,
  Divider,
  Box
} from '@mui/material';

const SelectorHojas = ({ hojas, hojasSeleccionadas, setHojasSeleccionadas }) => {
  const handleToggle = (hoja) => {
    if (hojasSeleccionadas.includes(hoja)) {
      setHojasSeleccionadas(hojasSeleccionadas.filter(h => h !== hoja));
    } else {
      setHojasSeleccionadas([...hojasSeleccionadas, hoja]);
    }
  };

  if (hojas.length === 0) return null;

  return (
    <Paper
      elevation={4}
      sx={{
        p: 3,
        mb: 3,
        borderLeft: '6px solid #2e7d32', 
        backgroundColor: '#f9f9f9'
      }}
    >
      <Box display="flex" flexDirection="column" gap={2}>
        <Typography variant="h6" sx={{ color: '#2e7d32' }}>
          Selección de hojas
        </Typography>
        <Divider />
        <FormControl component="fieldset" variant="standard">
          <FormLabel component="legend">
            <Typography variant="body1" sx={{ mb: 1 }}>
              Marca las hojas que deseas combinar:
            </Typography>
          </FormLabel>
          <FormGroup row sx={{ flexWrap: 'wrap' }}>
            {hojas.map((hoja) => (
              <FormControlLabel
                key={hoja}
                control={
                  <Checkbox
                    checked={hojasSeleccionadas.includes(hoja)}
                    onChange={() => handleToggle(hoja)}
                    name={hoja}
                    sx={{
                      color: '#2e7d32',
                      '&.Mui-checked': {
                        color: '#ffcd00', 
                      },
                    }}
                  />
                }
                label={<Typography variant="body2">{hoja}</Typography>}
              />
            ))}
          </FormGroup>
        </FormControl>
      </Box>
    </Paper>
  );
};

export default SelectorHojas;