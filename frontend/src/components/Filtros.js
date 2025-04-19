import React from 'react';
import {
  Grid,
  TextField,
  MenuItem,
  Button,
  Typography,
  Paper,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Box,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import SelectoresAgrupacion from './SelectoresAgrupacion';

const Filtros = ({
  columnas,
  valoresUnicos,
  filtros,
  setFiltros,
  handleClearFilters,
  columnasFecha = [],
  columnasNumericas = [],
  columnaAgrupacion,
  setColumnaAgrupacion,
  columnaValor,
  setColumnaValor,
}) => {
  return (
    <Paper elevation={4} sx={{ p: 4, mt: 4, mb: 4, borderRadius: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#388E3C' }}>
        Filtros de análisis
      </Typography>

      <Box sx={{ mb: 3 }}>
        <SelectoresAgrupacion
          columnas={columnas}
          columnaAgrupacion={columnaAgrupacion}
          setColumnaAgrupacion={setColumnaAgrupacion}
          columnaValor={columnaValor}
          setColumnaValor={setColumnaValor}
        />
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Búsqueda global */}
      <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Buscar en todos los campos"
            fullWidth
            variant="outlined"
            value={filtros.busqueda || ''}
            onChange={(e) => setFiltros((prev) => ({ ...prev, busqueda: e.target.value }))}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>

      {/* Filtros por categoría */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight="bold">Filtrar por categorías</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            {columnas.map(
              (col) =>
                valoresUnicos[col]?.length < 100 && (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={col}>
                    <TextField
                      select
                      label={col}
                      value={filtros[col] || ''}
                      onChange={(e) =>
                        setFiltros((prev) => ({ ...prev, [col]: e.target.value }))
                      }
                      fullWidth
                      size="small"
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
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Filtro por fecha */}
      {columnasFecha.length > 0 && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="bold">Filtrar por fechas</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {columnasFecha.map((col) => (
                <React.Fragment key={col}>
                  <Grid item xs={12} sm={6} md={3}>
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
                  <Grid item xs={12} sm={6} md={3}>
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
            </Grid>
          </AccordionDetails>
        </Accordion>
      )}

      {/* Filtro por valores numéricos */}
      {columnasNumericas.length > 0 && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="bold">Filtrar por valores numéricos</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {columnasNumericas.map((col) => (
                <React.Fragment key={col}>
                  <Grid item xs={12} sm={6} md={3}>
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
                  <Grid item xs={12} sm={6} md={3}>
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
            </Grid>
          </AccordionDetails>
        </Accordion>
      )}

      {/* Botón limpiar filtros */}
      <Box display="flex" justifyContent="flex-end" mt={4}>
        <Button
          variant="outlined"
          color="error"
          onClick={handleClearFilters}
          startIcon={<ClearAllIcon />}
          sx={{ px: 3, py: 1 }}
        >
          Limpiar filtros
        </Button>
      </Box>
    </Paper>
  );
};

export default Filtros;