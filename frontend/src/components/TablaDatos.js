import React from 'react';
import {
  TextField, Grid, MenuItem, Button, InputAdornment, Box
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

function Filtros({ filtros, columnas, onFiltroChange, onLimpiarFiltros }) {
  return (
    <Box sx={{ mt: 4, mb: 2 }}>
      <Grid container spacing={2}>
        {columnas.map((col) => (
          <Grid item xs={12} sm={6} md={4} key={col}>
            <TextField
              label={col}
              variant="outlined"
              fullWidth
              value={filtros[col] || ''}
              onChange={(e) => onFiltroChange(col, e.target.value)}
            />
          </Grid>
        ))}
        <Grid item xs={12}>
          <Button
            variant="outlined"
            startIcon={<ClearIcon />}
            onClick={onLimpiarFiltros}
          >
            Limpiar filtros
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Filtros;


// src/components/Graficos.js
import React from 'react';
import {
  Box, Typography, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

function Graficos({ datos, columnas, columnaAgrupar, setColumnaAgrupar, columnaValor, setColumnaValor }) {
  const datosAgrupados = React.useMemo(() => {
    const agrupado = {};
    datos.forEach((row) => {
      const key = row[columnaAgrupar];
      const valor = parseFloat(row[columnaValor]) || 0;
      agrupado[key] = (agrupado[key] || 0) + valor;
    });
    return Object.entries(agrupado).map(([key, value]) => ({ [columnaAgrupar]: key, [columnaValor]: value }));
  }, [datos, columnaAgrupar, columnaValor]);

  return (
    <Box sx={{ mt: 5 }}>
      <Typography variant="h6" gutterBottom>
        Gráfico de {columnaValor} por {columnaAgrupar}
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <FormControl>
          <InputLabel>Grupo</InputLabel>
          <Select
            value={columnaAgrupar}
            onChange={(e) => setColumnaAgrupar(e.target.value)}
            label="Grupo"
          >
            {columnas.map((col) => (
              <MenuItem key={col} value={col}>{col}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel>Valor</InputLabel>
          <Select
            value={columnaValor}
            onChange={(e) => setColumnaValor(e.target.value)}
            label="Valor"
          >
            {columnas.map((col) => (
              <MenuItem key={col} value={col}>{col}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={datosAgrupados}>
          <XAxis dataKey={columnaAgrupar} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey={columnaValor} fill="#1976d2" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}

export default Graficos;


// src/components/TablaDatos.js
import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Paper, Box } from '@mui/material';

function TablaDatos({ datos, columnas }) {
  const filas = datos.map((row, i) => ({ id: i, ...row }));

  return (
    <Box mt={4}>
      <Paper elevation={3} sx={{ height: 500 }}>
        <DataGrid
          rows={filas}
          columns={columnas.map(col => ({ field: col, headerName: col, flex: 1 }))}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
        />
      </Paper>
    </Box>
  );
}

export default TablaDatos;
