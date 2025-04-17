import React from 'react';
import {
  Grid,
  TextField,
  MenuItem,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  InputAdornment,
  Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import SelectoresAgrupacion from './SelectoresAgrupacion';

const Filtros = ({
  columnas,
  filtros,
  setFiltros,
  columnaAgrupacion,
  setColumnaAgrupacion,
  columnaValor,
  setColumnaValor,
  onLimpiarFiltros,
}) => {
  return (
    <Accordion defaultExpanded sx={{ mb: 3, borderRadius: 2 }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
        sx={{ backgroundColor: '#E8F5E9', borderRadius: 2 }}
      >
        <Typography variant="h6" sx={{ color: '#388E3C', fontWeight: 'bold' }}>
          Filtros de búsqueda
        </Typography>
      </AccordionSummary>

      <AccordionDetails>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="🔎 Búsqueda global"
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
              sx={{ bgcolor: 'white', borderRadius: 2 }}
            />
          </Grid>

          {columnas.includes('Dependencia') && (
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                select
                label="Dependencia"
                fullWidth
                variant="outlined"
                value={filtros.dependencia || ''}
                onChange={(e) =>
                  setFiltros((prev) => ({
                    ...prev,
                    dependencia: e.target.value,
                  }))
                }
                sx={{ bgcolor: 'white', borderRadius: 2 }}
              >
                <MenuItem value="">Todas</MenuItem>
                {[...new Set(filtros.opcionesDependencia || [])].map(
                  (dep) => (
                    <MenuItem key={dep} value={dep}>
                      {dep}
                    </MenuItem>
                  )
                )}
              </TextField>
            </Grid>
          )}

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Pago mínimo"
              type="number"
              fullWidth
              variant="outlined"
              value={filtros.pagoMin || ''}
              onChange={(e) =>
                setFiltros((prev) => ({
                  ...prev,
                  pagoMin: e.target.value,
                }))
              }
              sx={{ bgcolor: 'white', borderRadius: 2 }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Pago máximo"
              type="number"
              fullWidth
              variant="outlined"
              value={filtros.pagoMax || ''}
              onChange={(e) =>
                setFiltros((prev) => ({
                  ...prev,
                  pagoMax: e.target.value,
                }))
              }
              sx={{ bgcolor: 'white', borderRadius: 2 }}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="outlined"
              color="error"
              onClick={onLimpiarFiltros}
              startIcon={<ClearAllIcon />}
              sx={{ mt: 1 }}
            >
              Limpiar filtros
            </Button>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <SelectoresAgrupacion
          columnas={columnas}
          columnaAgrupar={columnaAgrupacion}
          setColumnaAgrupar={setColumnaAgrupacion}
          columnaValor={columnaValor}
          setColumnaValor={setColumnaValor}
        />
      </AccordionDetails>
    </Accordion>
  );
};

export default Filtros;