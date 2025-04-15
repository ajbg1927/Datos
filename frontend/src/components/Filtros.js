import React, { useEffect, useState } from 'react';
import {
  Box, TextField, MenuItem, InputAdornment, Button,
  Grid, Typography, IconButton
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Clear } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';

const Filtros = ({ columnas, datosOriginales, onFiltrar }) => {
  const [filtros, setFiltros] = useState({});
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [pagos, setPagos] = useState({ min: '', max: '' });

  const columnasCategorizables = columnas.filter(col =>
    datosOriginales.every(fila => typeof fila[col] === 'string')
  );

  const aplicarFiltros = () => {
    let datosFiltrados = [...datosOriginales];

    // Filtro global por texto
    if (busqueda) {
      datosFiltrados = datosFiltrados.filter(fila =>
        Object.values(fila).some(val =>
          String(val).toLowerCase().includes(busqueda.toLowerCase())
        )
      );
    }

    // Filtros categóricos
    columnasCategorizables.forEach(col => {
      if (filtros[col]) {
        datosFiltrados = datosFiltrados.filter(fila => fila[col] === filtros[col]);
      }
    });

    // Filtro por rango de pagos
    if (pagos.min) {
      datosFiltrados = datosFiltrados.filter(fila => parseFloat(fila.Pagos || 0) >= parseFloat(pagos.min));
    }
    if (pagos.max) {
      datosFiltrados = datosFiltrados.filter(fila => parseFloat(fila.Pagos || 0) <= parseFloat(pagos.max));
    }

    // Filtro por fecha
    if (fechaInicio || fechaFin) {
      datosFiltrados = datosFiltrados.filter(fila => {
        const fecha = new Date(fila.Fecha);
        if (fechaInicio && fecha < fechaInicio) return false;
        if (fechaFin && fecha > fechaFin) return false;
        return true;
      });
    }

    onFiltrar(datosFiltrados);
  };

  useEffect(() => {
    aplicarFiltros();
  }, [filtros, fechaInicio, fechaFin, busqueda, pagos]);

  const limpiarFiltros = () => {
    setFiltros({});
    setFechaInicio(null);
    setFechaFin(null);
    setBusqueda('');
    setPagos({ min: '', max: '' });
    onFiltrar(datosOriginales);
  };

  const dependenciasUnicas = [...new Set(datosOriginales.map(d => d.Dependencia))].filter(Boolean);

  return (
    <Box p={3}>
      <Typography variant="h6" gutterBottom>Filtros</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            variant="outlined"
            label="Buscar global"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
          />
        </Grid>

        {columnasCategorizables.map((col, i) => {
          const valoresUnicos = [...new Set(datosOriginales.map(f => f[col]))].filter(Boolean);
          return (
            <Grid item xs={6} md={3} key={i}>
              <TextField
                select
                fullWidth
                label={col}
                value={filtros[col] || ''}
                onChange={(e) =>
                  setFiltros(prev => ({ ...prev, [col]: e.target.value }))
                }
              >
                <MenuItem value="">Todos</MenuItem>
                {valoresUnicos.map((val, j) => (
                  <MenuItem key={j} value={val}>{val}</MenuItem>
                ))}
              </TextField>
            </Grid>
          );
        })}

        <Grid item xs={6} md={2}>
          <TextField
            label="Pago mínimo"
            fullWidth
            type="number"
            value={pagos.min}
            onChange={(e) => setPagos(prev => ({ ...prev, min: e.target.value }))}
          />
        </Grid>
        <Grid item xs={6} md={2}>
          <TextField
            label="Pago máximo"
            fullWidth
            type="number"
            value={pagos.max}
            onChange={(e) => setPagos(prev => ({ ...prev, max: e.target.value }))}
          />
        </Grid>

        <Grid item xs={6} md={3}>
          <DatePicker
            label="Fecha desde"
            value={fechaInicio}
            onChange={setFechaInicio}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <DatePicker
            label="Fecha hasta"
            value={fechaFin}
            onChange={setFechaFin}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            onClick={limpiarFiltros}
            startIcon={<Clear />}
          >
            Limpiar filtros
          </Button>
        </Grid>
      </Grid>

      <Box mt={2}>
        <Typography variant="body2" color="text.secondary">
          {`Registros visibles: ${datosOriginales.length}`}
          {Object.keys(filtros).length > 0 || busqueda || pagos.min || pagos.max || fechaInicio || fechaFin
            ? ' (filtros activos)' : ''}
        </Typography>
      </Box>
    </Box>
  );
};

export default Filtros;
