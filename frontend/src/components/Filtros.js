import React from 'react';
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Grid,
  Typography,
} from '@mui/material';

const Filtros = ({
  columnas,
  valoresUnicos,
  filtros,
  setFiltros,
  handleClearFilters,
  columnasFecha,
  columnasNumericas,
}) => {
  const handleChange = (columna, valor) => {
    setFiltros((prev) => ({
      ...prev,
      [columna]: valor,
    }));
  };

  return (
    <Box sx={{ p: 2, borderBottom: '1px solid #ccc' }}>
      <Typography variant="h6" gutterBottom>
        Filtros Avanzados
      </Typography>

      <Grid container spacing={2} sx={{ mb: 1 }}>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Búsqueda global"
            value={filtros.busqueda || ''}
            onChange={(e) => handleChange('busqueda', e.target.value)}
          />
        </Grid>

        {columnasFecha.map((col) => (
          <React.Fragment key={col}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                type="date"
                label="Fecha desde"
                InputLabelProps={{ shrink: true }}
                value={filtros.Fecha_desde || ''}
                onChange={(e) => handleChange('Fecha_desde', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                type="date"
                label="Fecha hasta"
                InputLabelProps={{ shrink: true }}
                value={filtros.Fecha_hasta || ''}
                onChange={(e) => handleChange('Fecha_hasta', e.target.value)}
              />
            </Grid>
          </React.Fragment>
        ))}

        {columnasNumericas.map((col) => (
          <React.Fragment key={col}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                type="number"
                label={`${col} mínimo`}
                value={filtros[`${col}_min`] || ''}
                onChange={(e) =>
                  handleChange(`${col}_min`, e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                type="number"
                label={`${col} máximo`}
                value={filtros[`${col}_max`] || ''}
                onChange={(e) =>
                  handleChange(`${col}_max`, e.target.value)
                }
              />
            </Grid>
          </React.Fragment>
        ))}
      </Grid>

      <Grid container spacing={2}>
        {columnas.map((col) => {
          if (
            ['busqueda', 'Fecha_desde', 'Fecha_hasta'].includes(col) ||
            columnasNumericas.some((c) => col.includes(c))
          )
            return null;

          const opciones = valoresUnicos[col] || [];

          return (
            <Grid item xs={12} sm={6} md={4} key={col}>
              <TextField
                select
                fullWidth
                label={`Filtrar por ${col}`}
                value={filtros[col] || ''}
                onChange={(e) => handleChange(col, e.target.value)}
              >
                <MenuItem value="">Todos</MenuItem>
                {opciones.map((opcion, index) => (
                  <MenuItem key={index} value={opcion}>
                    {opcion}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          );
        })}
      </Grid>

      <Box sx={{ mt: 2 }}>
        <Button variant="outlined" onClick={handleClearFilters}>
          Limpiar filtros
        </Button>
      </Box>
    </Box>
  );
};

export default Filtros;