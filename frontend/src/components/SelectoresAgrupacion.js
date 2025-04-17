import React from 'react';
import {
  Paper,
  Typography,
  Stack,
  Autocomplete,
  TextField,
} from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

const SelectoresAgrupacion = ({
  columnas,
  columnaAgrupar,
  setColumnaAgrupar,
  columnaValor,
  setColumnaValor,
}) => {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        mb: 4,
        borderRadius: 3,
        backgroundColor: '#f9f9f9',
        borderLeft: '6px solid #388E3C',
      }}
    >
      <Typography
        variant="h6"
        fontWeight="bold"
        sx={{ color: '#388E3C', mb: 2 }}
      >
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
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <>
                    <GroupIcon sx={{ color: '#4CAF50', mr: 1 }} />
                    {params.InputProps.startAdornment}
                  </>
                ),
              }}
              sx={{
                bgcolor: 'white',
                borderRadius: 2,
              }}
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
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <>
                    <MonetizationOnIcon sx={{ color: '#4CAF50', mr: 1 }} />
                    {params.InputProps.startAdornment}
                  </>
                ),
              }}
              sx={{
                bgcolor: 'white',
                borderRadius: 2,
              }}
            />
          )}
          fullWidth
        />
      </Stack>
    </Paper>
  );
};

export default SelectoresAgrupacion;