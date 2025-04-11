import React from 'react';
import { Box, TextField, Button } from '@mui/material';

const Filtros = ({ filtro, setFiltro, aplicarFiltro, limpiarFiltro }) => {
  return (
    <Box display="flex" alignItems="center" gap={2} m={2}>
      <TextField
        label="Filtrar por texto"
        variant="outlined"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
      />
      <Button variant="contained" onClick={aplicarFiltro}>Filtrar</Button>
      <Button variant="outlined" onClick={limpiarFiltro}>Limpiar</Button>
    </Box>
  );
};

export default Filtros;