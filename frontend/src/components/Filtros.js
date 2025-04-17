import React from 'react';
import {
  Grid,
  TextField,
  MenuItem,
  Button,
  Typography,
  Paper,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const Filtros = ({
  columnas,
  valoresUnicos,
  filtros,
  setFiltros,
  handleClearFilters,
  columnasFecha = [],
  columnasNumericas = [],
}) => {
  return (
    <Paper elevation={3} sx={{ p: { xs: 2, md: 3 }, mt: 4, mb: 4, boxShadow: 4 }}>
      <Typography variant="h6" gutterBottom>
        Filtros de búsqueda
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Búsqueda global"
            fullWidth
            variant="outlined"
            value={filtros.busqueda || ''}
            onChange={(e) =>
              setFiltros((prev) => ({ ...prev, busqueda: e.target.value }))
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {columnas.map(
          (col) =>
            valoresUnicos[col]?.length < 100 && (
              <Grid item xs={12} sm={6} md={3} key={col}>
                <TextField
                  select
                  label={col}
                  value={filtros[col] || ''}
                  onChange={(e) =>
                    setFiltros((prev) => ({ ...prev, [col]: e.target.value }))
                  }
                  fullWidth
                >
                  <MenuItem value="">Todos</MenuItem>
                  {valoresUnicos[col]?.map((valor, idx) => (
                    <MenuItem key={idx} value={valor}>
                      {valor}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            )
        )}

        {(columnasFecha || []).map((col) => (
          <React.Fragment key={col}>
            <Grid item xs={6} sm={3}>
              <TextField
                label={`Desde (${col})`}
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={filtros[`${col}_desde`] || ''}
                onChange={(e) =>
                  setFiltros((prev) => ({
                    ...prev,
                    [`${col}_desde`]: e.target.value,
                  }))
                }
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                label={`Hasta (${col})`}
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={filtros[`${col}_hasta`] || ''}
                onChange={(e) =>
                  setFiltros((prev) => ({
                    ...prev,
                    [`${col}_hasta`]: e.target.value,
                  }))
                }
              />
            </Grid>
          </React.Fragment>
        ))}

        {(columnasNumericas || []).map((col) => (
          <React.Fragment key={col}>
            <Grid item xs={6} sm={3}>
              <TextField
                label={`Mín. ${col}`}
                type="number"
                fullWidth
                value={filtros[`${col}_min`] || ''}
                onChange={(e) =>
                  setFiltros((prev) => ({
                    ...prev,
                    [`${col}_min`]: e.target.value,
                  }))
                }
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                label={`Máx. ${col}`}
                type="number"
                fullWidth
                value={filtros[`${col}_max`] || ''}
                onChange={(e) =>
                  setFiltros((prev) => ({
                    ...prev,
                    [`${col}_max`]: e.target.value,
                  }))
                }
              />
            </Grid>
          </React.Fragment>
        ))}

        <Grid item xs={12} textAlign="right">
          <Button variant="outlined" color="error" onClick={handleClearFilters}>
            Limpiar filtros
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Filtros;