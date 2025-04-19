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
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import GroupIcon from '@mui/icons-material/Group';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ClearAllIcon from '@mui/icons-material/ClearAll';

const Filtros = ({
  columnas,
  valorBusqueda,
  setValorBusqueda,
  columnaAgrupar,
  setColumnaAgrupar,
  columnaValor,
  setColumnaValor,
  filtros,
  setFiltros,
  limpiarFiltros
}) => {
  const columnasFiltrables = columnas.filter(
    (col) => col !== columnaAgrupar && col !== columnaValor
  );

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'green', mb: 2 }}>
        Filtros de análisis
      </Typography>

      {/* Buscador Global */}
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Buscar..."
        value={valorBusqueda}
        onChange={(e) => setValorBusqueda(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />

      <Divider sx={{ my: 2 }} />

      {/* Visualización de Gráficos */}
      <Typography variant="subtitle1" sx={{ color: 'green', fontWeight: 'bold', mb: 2 }}>
        Visualización de Gráficos
      </Typography>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={6}>
          <TextField
            fullWidth
            select
            label="Agrupar por"
            value={columnaAgrupar}
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

        <Grid item xs={6}>
          <TextField
            fullWidth
            select
            label="Columna de valor"
            value={columnaValor}
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

      {/* Filtros por Categorías */}
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
        Filtrar por categorías
      </Typography>
      <Grid container spacing={2}>
        {columnasFiltrables.map((col) => (
          <Grid item xs={12} key={col}>
            <TextField
              fullWidth
              select
              label={col}
              value={filtros[col] || ''}
              onChange={(e) => setFiltros((prev) => ({ ...prev, [col]: e.target.value }))}
            >
              <MenuItem value="">Todos</MenuItem>
              {/* Opcionalmente puedes pasar aquí los valores únicos por columna */}
            </TextField>
          </Grid>
        ))}
      </Grid>

      {/* Botón Limpiar Filtros */}
      <Box mt={4} textAlign="center">
        <Button
          variant="contained"
          color="error"
          startIcon={<ClearAllIcon />}
          onClick={limpiarFiltros}
        >
          Limpiar Filtros
        </Button>
      </Box>
    </Paper>
  );
};

export default Filtros;