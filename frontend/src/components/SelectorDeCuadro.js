import React from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

const SelectorDeCuadro = ({
  cuadros = [],
  seleccionarCuadro,
  cuadroSeleccionado,
  label = 'Cuadro',
  obtenerValor = (cuadro) => (typeof cuadro === 'object' ? cuadro.id : cuadro),
  obtenerEtiqueta = (cuadro) => (typeof cuadro === 'object' ? cuadro.nombre : cuadro),
}) => {
  const labelId = 'selector-cuadro-label';
  const selectId = 'selector-cuadro';

  return (
    <Box sx={{ mb: 3 }}>
      <FormControl fullWidth variant="outlined" sx={{ backgroundColor: '#f5f5f5' }}>
        <InputLabel id={labelId} sx={{ color: '#000' }}>{label}</InputLabel>
        <Select
          labelId={labelId}
          id={selectId}
          value={cuadroSeleccionado || ''}
          label={label}
          onChange={(e) => seleccionarCuadro(e.target.value)}
          displayEmpty
          renderValue={(selected) => {
            if (!selected) return `Selecciona un ${label.toLowerCase()}`;
            const seleccionado = cuadros.find((cuadro) => obtenerValor(cuadro) === selected);
            return seleccionado ? obtenerEtiqueta(seleccionado) : selected;
          }}
          sx={{
            backgroundColor: '#f5f5f5',
            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#cfd8dc' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#43a047' },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#43a047' },
          }}
        >
          <MenuItem disabled value="">
            -- Selecciona un {label.toLowerCase()} --
          </MenuItem>

          {cuadros.length > 0 ? (
            cuadros.map((cuadro) => {
              const valor = obtenerValor(cuadro);
              const etiqueta = obtenerEtiqueta(cuadro);
              return (
                <MenuItem
                  key={valor}
                  value={valor}
                  sx={{
                    color: '#37474f',
                    '&:hover': { backgroundColor: '#dcedc8' },
                  }}
                >
                  {etiqueta}
                </MenuItem>
              );
            })
          ) : (
            <MenuItem disabled value="">
              No hay cuadros disponibles
            </MenuItem>
          )}
        </Select>
      </FormControl>
    </Box>
  );
};

export default SelectorDeCuadro;