import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Container, Grid, TextField, MenuItem, Typography, Box, Paper, Button, Checkbox, FormControlLabel } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { saveAs } from 'file-saver';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  const [archivos, setArchivos] = useState([]);
  const [datosCombinados, setDatosCombinados] = useState([]);
  const [nombresHojasPorArchivo, setNombresHojasPorArchivo] = useState({});
  const [hojasSeleccionadas, setHojasSeleccionadas] = useState({});
  const [columnasUnicas, setColumnasUnicas] = useState([]);
  const [columnaAgrupar, setColumnaAgrupar] = useState('Dependencia');
  const [columnaValor, setColumnaValor] = useState('Pago');
  const [filtros, setFiltros] = useState({ dependencia: '', fechaInicio: null, fechaFin: null });

  const handleArchivos = (e) => {
    const files = Array.from(e.target.files);
    const hojas = {};
    const nombres = {};
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        nombres[file.name] = workbook.SheetNames;
        hojas[file.name] = workbook.SheetNames.reduce((acc, nombre) => {
          acc[nombre] = false;
          return acc;
        }, {});
        setNombresHojasPorArchivo(prev => ({ ...prev, ...nombres }));
        setHojasSeleccionadas(prev => ({ ...prev, ...hojas }));
      };
      reader.readAsArrayBuffer(file);
    });
    setArchivos(files);
  };

  useEffect(() => {
    const combinarDatos = async () => {
      let allData = [];
      let allColumns = new Set();

      for (let file of archivos) {
        const reader = new FileReader();
        await new Promise((resolve) => {
          reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const hojas = hojasSeleccionadas[file.name];
            Object.keys(hojas).forEach(nombre => {
              if (hojas[nombre]) {
                const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[nombre]);
                jsonData.forEach(row => {
                  allColumns = new Set([...allColumns, ...Object.keys(row)]);
                });
                allData = [...allData, ...jsonData];
              }
            });
            resolve();
          };
          reader.readAsArrayBuffer(file);
        });
      }

      setDatosCombinados(allData);
      setColumnasUnicas([...allColumns]);
    };

    if (archivos.length > 0) combinarDatos();
  }, [hojasSeleccionadas]);

  const cambiarCheckbox = (archivo, hoja) => {
    setHojasSeleccionadas(prev => ({
      ...prev,
      [archivo]: {
        ...prev[archivo],
        [hoja]: !prev[archivo][hoja]
      }
    }));
  };

  const datosFiltrados = datosCombinados.filter(row => {
    const dep = filtros.dependencia;
    const fechaCol = row['Fecha'] ? new Date(row['Fecha']) : null;
    const cumpleDep = dep ? row['Dependencia'] === dep : true;
    const cumpleFecha = filtros.fechaInicio && filtros.fechaFin && fechaCol
      ? (fechaCol >= filtros.fechaInicio && fechaCol <= filtros.fechaFin)
      : true;
    return cumpleDep && cumpleFecha;
  });

  const datosAgrupados = Object.values(datosFiltrados.reduce((acc, row) => {
    const key = row[columnaAgrupar];
    const valor = parseFloat(row[columnaValor]) || 0;
    if (!acc[key]) acc[key] = { [columnaAgrupar]: key, [columnaValor]: 0 };
    acc[key][columnaValor] += valor;
    return acc;
  }, {}));

  const exportarExcel = () => {
    const ws = XLSX.utils.json_to_sheet(datosFiltrados);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Filtrados');
    const blob = new Blob([XLSX.write(wb, { bookType: 'xlsx', type: 'array' })], { type: 'application/octet-stream' });
    saveAs(blob, 'datos_filtrados.xlsx');
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Header />
      <Container maxWidth="xl">
        <Box my={2}>
          <Typography variant="h5" gutterBottom>Visualizador de Datos Municipales</Typography>
          <input type="file" multiple onChange={handleArchivos} />
        </Box>

        {archivos.map((file) => (
          <Box key={file.name} mb={2}>
            <Typography variant="subtitle1">{file.name}</Typography>
            <Grid container spacing={1}>
              {nombresHojasPorArchivo[file.name]?.map(nombre => (
                <Grid item key={nombre}>
                  <FormControlLabel
                    control={<Checkbox checked={hojasSeleccionadas[file.name]?.[nombre] || false} onChange={() => cambiarCheckbox(file.name, nombre)} />}
                    label={nombre}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              select
              label="Agrupar por"
              value={columnaAgrupar}
              onChange={(e) => setColumnaAgrupar(e.target.value)}
              fullWidth
            >
              {columnasUnicas.map(col => <MenuItem key={col} value={col}>{col}</MenuItem>)}
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              select
              label="Valor a mostrar"
              value={columnaValor}
              onChange={(e) => setColumnaValor(e.target.value)}
              fullWidth
            >
              {columnasUnicas.map(col => <MenuItem key={col} value={col}>{col}</MenuItem>)}
            </TextField>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              select
              label="Dependencia"
              value={filtros.dependencia}
              onChange={(e) => setFiltros(prev => ({ ...prev, dependencia: e.target.value }))}
              fullWidth
            >
              <MenuItem value="">Todas</MenuItem>
              {[...new Set(datosCombinados.map(d => d['Dependencia']).filter(Boolean))].map(dep => (
                <MenuItem key={dep} value={dep}>{dep}</MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={6} md={4}>
            <DatePicker
              label="Desde"
              value={filtros.fechaInicio}
              onChange={(date) => setFiltros(prev => ({ ...prev, fechaInicio: date }))}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>

          <Grid item xs={6} md={4}>
            <DatePicker
              label="Hasta"
              value={filtros.fechaFin}
              onChange={(date) => setFiltros(prev => ({ ...prev, fechaFin: date }))}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>
        </Grid>

        <Box my={2}>
          <Button variant="contained" color="primary" onClick={exportarExcel}>Exportar Excel</Button>
        </Box>

        <Paper>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={datosAgrupados}>
              <XAxis dataKey={columnaAgrupar} />
              <YAxis />
              <Tooltip />
              <Bar dataKey={columnaValor} fill="#43a047" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>

      </Container>
      <Footer />
    </LocalizationProvider>
  );
}

export default App;


