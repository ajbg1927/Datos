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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#388E3C' }}>
        Filtros de búsqueda
      </Typography>

      <SelectoresAgrupacion
        columnas={columnas}
        columnaAgrupacion={columnaAgrupacion}
        setColumnaAgrupacion={setColumnaAgrupacion}
        columnaValor={columnaValor}
        setColumnaValor={setColumnaValor}
      />

      <Divider sx={{ my: 3 }} />

      <Grid container spacing={2} mb={3}>
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
      </Grid>

      {/* Filtros por columna */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight="bold">Filtrar por categoría</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
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

      {/* Fechas */}
      {columnasFecha.length > 0 && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="bold">Filtrar por fecha</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {columnasFecha.map((col) => (
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
            </Grid>
          </AccordionDetails>
        </Accordion>
      )}

      {/* Números */}
      {columnasNumericas.length > 0 && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="bold">Filtrar por valores numéricos</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {columnasNumericas.map((col) => (
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
            </Grid>
          </AccordionDetails>
        </Accordion>
      )}

      <Grid container justifyContent="flex-end" mt={3}>
        <Button
          variant="contained"
          color="error"
          onClick={handleClearFilters}
          sx={{ px: 4, py: 1 }}
        >
          Limpiar filtros
        </Button>
      </Grid>
    </Paper>
  );
};

export default Filtros;