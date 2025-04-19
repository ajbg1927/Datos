import React from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  MenuItem,
  Divider,
  Button,
  InputAdornment,
  Grid,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import GroupIcon from '@mui/icons-material/Group';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ClearAllIcon from '@mui/icons-material/ClearAll';

const Filtros = ({
  columnas,
  valoresUnicos = {},
  filtros,
  setFiltros,
  handleClearFilters,
  columnasFecha = [],
  columnasNumericas = [],
  valorBusqueda,
  setValorBusqueda,
  columnaAgrupar,
  setColumnaAgrupar,
  columnaValor,
  setColumnaValor,
}) => {
  const handleChange = (columna, valor) => {
    setFiltros((prev) => ({
      ...prev,
      [columna]: valor,
    }));
  };

  const columnasFiltrables = columnas.filter(
    (col) =>
      col !== columnaAgrupar &&
      col !== columnaValor &&
      !['busqueda', 'Fecha_desde', 'Fecha_hasta'].includes(col) &&
      !columnasNumericas.includes(col)
  );

  return (
    <Paper
      elevation={1}
      sx={{
        p: 3,
        borderRadius: 3,
        bgcolor: '#fdfdfd',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'green', mb: 2 }}>
        Filtros de análisis
      </Typography>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Buscar en todos los campos..."
        value={valorBusqueda || filtros.busqueda || ''}
        onChange={(e) => {
          if (setValorBusqueda) {
            setValorBusqueda(e.target.value);
          }
          handleChange('busqueda', e.target.value);
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />

      {columnasFecha.length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
            📅 Filtrar por fecha
          </Typography>
          <Grid container spacing={2}>
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
          </Grid>
        </>
      )}

      {columnasNumericas.length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
            🔢 Rango de valores
          </Typography>
          <Grid container spacing={2}>
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
        </>
      )}

      <Divider sx={{ my: 2 }} />
      <Typography variant="subtitle1" sx={{ color: 'green', fontWeight: 'bold', mb: 2 }}>
        📊 Visualización de Gráficos
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            select
            label="Agrupar por"
            value={columnaAgrupar || ''}
            onChange={(e) => setColumnaAgrupar(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <GroupIcon />
                </InputAdornment>
              ),
            }}
          >
            {columnas.map((col) => (
              <MenuItem key={col} value={col}>
                {col}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            select
            label="Columna de valor"
            value={columnaValor || ''}
            onChange={(e) => setColumnaValor(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AttachMoneyIcon />
                </InputAdornment>
              ),
            }}
          >
            {columnas.map((col) => (
              <MenuItem key={col} value={col}>
                {col}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
        Filtrar por categorías
      </Typography>
      <Grid container spacing={2}>
        {columnasFiltrables.map((col) => {
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

      <Box mt={4} textAlign="center">
        <Button
          variant="contained"
          color="error"
          startIcon={<ClearAllIcon />}
          onClick={handleClearFilters}
        >
          Limpiar Filtros
        </Button>
      </Box>
    </Paper>
  );
};

export default Filtros;