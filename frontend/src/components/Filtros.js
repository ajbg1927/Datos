import React from 'react';
import { Grid, TextField, MenuItem, Button } from '@mui/material';

const Filtros = ({
  columnas, valoresUnicos, filtros, setFiltros,
  handleClearFilters, columnasFecha, columnasNumericas
}) => {
  return (
    <Grid container spacing={2} mt={2}>
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          label="Búsqueda global"
          fullWidth
          value={filtros.busqueda || ''}
          onChange={(e) => setFiltros(prev => ({ ...prev, busqueda: e.target.value }))}
        />
      </Grid>

      {columnas.map(col => (
        valoresUnicos[col]?.length < 100 && (
          <Grid item xs={12} sm={6} md={3} key={col}>
            <TextField
              select
              label={col}
              value={filtros[col] || ''}
              onChange={(e) => setFiltros(prev => ({ ...prev, [col]: e.target.value }))}
              fullWidth
            >
              <MenuItem value="">Todos</MenuItem>
              {valoresUnicos[col]?.map((valor, idx) => (
                <MenuItem key={idx} value={valor}>{valor}</MenuItem>
              ))}
            </TextField>
          </Grid>
        )
      ))}

      {/* Fechas y valores numéricos si están */}
      {columnasFecha.map(col => (
        <Grid item xs={6} sm={3} key={col}>
          <TextField
            label={`Desde (${col})`}
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            onChange={(e) => setFiltros(prev => ({ ...prev, [`${col}_desde`]: e.target.value }))}
          />
        </Grid>
      ))}

      {columnasNumericas.map(col => (
        <Grid item xs={6} sm={3} key={col}>
          <TextField
            label={`Mín. ${col}`}
            type="number"
            fullWidth
            onChange={(e) => setFiltros(prev => ({ ...prev, [`${col}_min`]: e.target.value }))}
          />
        </Grid>
      ))}

      <Grid item xs={12}>
        <Button variant="outlined" color="secondary" onClick={handleClearFilters}>
          Limpiar filtros
        </Button>
      </Grid>
    </Grid>
  );
};

export default Filtros;

