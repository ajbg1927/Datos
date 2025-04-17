import React from 'react';
import {
  Paper,
  Typography,
  Stack,
  Autocomplete,
  TextField,
} from '@mui/material';

const SelectoresAgrupacion = ({
  columnas,
  columnaAgrupar,
  setColumnaAgrupar,
  columnaValor,
  setColumnaValor,
}) => {
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
      <Typography variant="h6" fontWeight="bold" sx={{ color: '#388E3C', mb: 2 }}>
        Visualización de Gráficos
      </Typography>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={3}
        justifyContent="flex-start"
      >
        <Autocomplete
          options={columnas}
          value={columnaAgrupar}
          onChange={(e, newValue) => setColumnaAgrupar(newValue || '')}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Agrupar por"
              variant="outlined"
              sx={{ bgcolor: 'white' }}
            />
          )}
          fullWidth
        />

        <Autocomplete
          options={columnas}
          value={columnaValor}
          onChange={(e, newValue) => setColumnaValor(newValue || '')}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Columna de valor"
              variant="outlined"
              sx={{ bgcolor: 'white' }}
            />
          )}
          fullWidth
        />
      </Stack>
    </Paper>
  );
};

export default SelectoresAgrupacion;