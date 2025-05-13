import React from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

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
    <Box>
      <Typography variant="h6" gutterBottom>
        Selecciona un Cuadro
      </Typography>

      <FormControl fullWidth>
        <InputLabel id={labelId}>{label}</InputLabel>
        <Select
          labelId={labelId}
          id={selectId}
          value={cuadroSeleccionado || ''}
          label={label}
          onChange={(e) => seleccionarCuadro(e.target.value)}
        >
          <MenuItem value="" disabled>
            -- Selecciona un cuadro --
          </MenuItem>

          {cuadros.length > 0 ? (
            cuadros.map((cuadro) => {
              const valor = obtenerValor(cuadro);
              const etiqueta = obtenerEtiqueta(cuadro);
              return (
                <MenuItem key={valor} value={valor}>
                  {etiqueta}
                </MenuItem>
              );
            })
          ) : (
            <MenuItem value="" disabled>
              No hay cuadros disponibles
            </MenuItem>
          )}
        </Select>
      </FormControl>
    </Box>
  );
};

export default SelectorDeCuadro;