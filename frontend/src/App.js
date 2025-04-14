import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  AppBar,
  Toolbar,
  Typography,
  CssBaseline,
  Container,
  Paper,
  Box,
  Grid,
  IconButton,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
import { CloudUpload, Download } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import logo from './assets/logo AM.png';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1b5e20',
    },
    secondary: {
      main: '#4caf50',
    },
  },
});

const Input = styled('input')({
  display: 'none',
});

function App() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [file, setFile] = useState(null);
  const [sheetNames, setSheetNames] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState('');
  const [entityFilter, setEntityFilter] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [minPago, setMinPago] = useState('');
  const [maxPago, setMaxPago] = useState('');

  useEffect(() => {
    filterData();
  }, [searchTerm, sectorFilter, entityFilter, startDate, endDate, minPago, maxPago, data]);

  const handleFileUpload = async (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('https://backend-flask-0rnq.onrender.com/upload', formData);
      setSheetNames(response.data.sheets);
      setSelectedSheet(response.data.sheets[0]);
      fetchSheetData(response.data.sheets[0]);
    } catch (error) {
      console.error('Error al subir el archivo:', error);
    }
  };

  const fetchSheetData = async (sheet) => {
    try {
      const response = await axios.get(`https://backend-flask-0rnq.onrender.com/data?sheet_name=${sheet}`);
      setData(response.data);
    } catch (error) {
      console.error('Error al obtener los datos de la hoja:', error);
    }
  };

  const filterData = () => {
    let filtered = data;

    if (searchTerm) {
      filtered = filtered.filter((row) =>
        Object.values(row).some((val) => val?.toString().toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (sectorFilter) {
      filtered = filtered.filter((row) => row['SECTOR'] === sectorFilter);
    }

    if (entityFilter) {
      filtered = filtered.filter((row) => row['ENTIDAD'] === entityFilter);
    }

    if (startDate && endDate) {
      filtered = filtered.filter((row) => {
        const fecha = new Date(row['FECHA']);
        return fecha >= startDate && fecha <= endDate;
      });
    }

    if (minPago) {
      filtered = filtered.filter((row) => parseFloat(row['PAGO']) >= parseFloat(minPago));
    }

    if (maxPago) {
      filtered = filtered.filter((row) => parseFloat(row['PAGO']) <= parseFloat(maxPago));
    }

    setFilteredData(filtered);
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'DatosFiltrados');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'datos_filtrados.xlsx');
  };

  const columns = data[0]
    ? Object.keys(data[0]).map((key) => ({ field: key, headerName: key, width: 150 }))
    : [];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="fixed" color="default" elevation={1}>
        <Toolbar>
          <Box component="img" src={logo} alt="Logo" sx={{ height: 60, mr: 2 }} />
          <Typography variant="h6" color="textPrimary" noWrap>
            Análisis de Datos - Municipio de Mosquera
          </Typography>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <label htmlFor="upload-file">
                <Input accept=".xlsx, .xls" id="upload-file" type="file" onChange={handleFileUpload} />
                <Button variant="contained" component="span" startIcon={<CloudUpload />}>
                  Subir archivo
                </Button>
              </label>
            </Grid>
            <Grid item>
              <FormControl fullWidth>
                <InputLabel>Hoja</InputLabel>
                <Select
                  value={selectedSheet}
                  onChange={(e) => {
                    setSelectedSheet(e.target.value);
                    fetchSheetData(e.target.value);
                  }}
                  label="Hoja"
                  sx={{ minWidth: 200 }}
                >
                  {sheetNames.map((name) => (
                    <MenuItem key={name} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth label="Buscar" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField fullWidth label="Sector" value={sectorFilter} onChange={(e) => setSectorFilter(e.target.value)} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField fullWidth label="Entidad" value={entityFilter} onChange={(e) => setEntityFilter(e.target.value)} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                placeholderText="Fecha inicio"
                customInput={<TextField fullWidth label="Fecha inicio" />} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                placeholderText="Fecha fin"
                customInput={<TextField fullWidth label="Fecha fin" />} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField fullWidth label="Pago mínimo" value={minPago} onChange={(e) => setMinPago(e.target.value)} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField fullWidth label="Pago máximo" value={maxPago} onChange={(e) => setMaxPago(e.target.value)} />
            </Grid>
          </Grid>
        </Paper>

      <div
        onDrop={manejarDrop}
        onDragOver={(e) => e.preventDefault()}
        style={{ border: "2px dashed gray", padding: 20, textAlign: "center", marginBottom: 20 }}
      >
        <p>Arrastra y suelta un archivo aquí o selecciona uno:</p>
        <input type="file" accept=".xlsx,.xls" onChange={manejarArchivo} />
        {cargando && <CircularProgress />}
      </div>
      
      <Box mb={2}>
        <Select
          value={archivoSeleccionado}
          onChange={(e) => {
            setArchivoSeleccionado(e.target.value);
            const encontrado = archivos.find(a => a.archivo === e.target.value);
            setHojas(encontrado ? encontrado.hojas : []);
            setHojasSeleccionadas([]);
          }}
          displayEmpty
          style={{ minWidth: 240 }}
        >
          <MenuItem value="" disabled>Selecciona un archivo</MenuItem>
          {archivos.map((archivoObj, idx) => (
            <MenuItem key={idx} value={archivoObj.archivo}>
              {archivoObj.archivo}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {hojas.length > 0 && (
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Seleccionar Hojas</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormGroup row>
              {hojas.map((hoja, idx) => (
                <FormControlLabel
                  key={idx}
                  control={<Checkbox checked={hojasSeleccionadas.includes(hoja)} onChange={() => {
                    setHojasSeleccionadas(prev => prev.includes(hoja)
                      ? prev.filter(h => h !== hoja)
                      : [...prev, hoja]);
                  }} />}
                  label={hoja}
                />
              ))}
            </FormGroup>
            <Button variant="contained" onClick={cargarDatos}>Cargar Datos</Button>
          </AccordionDetails>
        </Accordion>
      )}

      {!cargando && datos.length === 0 && (
        <Typography variant="body2" color="textSecondary">
          No hay datos cargados aún. Selecciona un archivo y una hoja.
        </Typography>
      )}

    <Box mt={3}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <TextField
            label="Filtro Global 🔍"
            value={filtroGlobal}
            onChange={(e) => setFiltroGlobal(e.target.value)}
            fullWidth
          />
        </Grid>

        <Grid item xs={6} md={2}>
          <DatePicker
            selected={fechaInicio}
            onChange={(date) => setFechaInicio(date)}
            placeholderText="Fecha Inicio 📅"
            className="form-control"
          />
        </Grid>
        <Grid item xs={6} md={2}>
          <DatePicker
            selected={fechaFin}
            onChange={(date) => setFechaFin(date)}
            placeholderText="Fecha Fin 📅"
            className="form-control"
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            label="Dependencia 🏢"
            value={dependencia}
            onChange={(e) => setDependencia(e.target.value)}
            fullWidth
          />
        </Grid>

        <Grid item xs={6} md={2}>
          <TextField
            label="Pagos Mín 💰"
            value={pagosMin}
            onChange={(e) => setPagosMin(e.target.value)}
            type="number"
            fullWidth
          />
        </Grid>
        <Grid item xs={6} md={2}>
          <TextField
            label="Pagos Máx 💰"
            value={pagosMax}
            onChange={(e) => setPagosMax(e.target.value)}
            type="number"
            fullWidth
          />
        </Grid>

        <Grid item xs={6} md={4}>
          <TextField
            label="Columna Específica"
            value={columnaSeleccionada}
            onChange={(e) => setColumnaSeleccionada(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={6} md={4}>
          <TextField
            label="Valor a Buscar"
            value={valorEspecifico}
            onChange={(e) => setValorEspecifico(e.target.value)}
            fullWidth
          />
        </Grid>
      </Grid>
    </Box>

    <Box mt={3}>
      <Typography variant="h6">Selecciona columnas para exportar:</Typography>
      <FormGroup row>
        {columnas.map((col) => (
          <FormControlLabel
            key={col.field}
            control={
              <Checkbox
                checked={columnasSeleccionadas.includes(col.field)}
                onChange={() =>
                  setColumnasSeleccionadas((prev) =>
                    prev.includes(col.field)
                      ? prev.filter((c) => c !== col.field)
                      : [...prev, col.field]
                  )
                }
              />
            }
            label={col.headerName}
          />
        ))}
      </FormGroup>

      <Box mt={2}>
        <Button variant="contained" onClick={exportarExcel} sx={{ mr: 1 }}>
          Exportar a Excel
        </Button>
        <Button variant="contained" onClick={exportarCSV} sx={{ mr: 1 }}>
          Exportar a CSV
        </Button>
        <Button variant="contained" onClick={exportarPDF} sx={{ mr: 1 }}>
          Exportar a PDF
        </Button>
        <Button variant="outlined" onClick={generarInforme}>
          Generar Informe TXT
        </Button>
      </Box>
    </Box>

    <Box mt={4} style={{ height: 500, width: "100%" }}>
      <DataGrid
        rows={datosFiltrados.map((row, index) => ({ id: index, ...row }))}
        columns={columnas}
        pageSize={rowsPerPage}
        onPageSizeChange={(newPageSize) => setRowsPerPage(newPageSize)}
        pagination
        paginationModel={{ pageSize: rowsPerPage, page: page }}
        onPaginationModelChange={({ page }) => setPage(page)}
        rowsPerPageOptions={[5, 10, 20, 50, 100]}
        disableRowSelectionOnClick
      />
    </Box>

    {datosParaGraficos.length > 0 && (
      <Box mt={5}>
        <Typography variant="h6" gutterBottom>
          Gráfico de Total de Pagos por Dependencia 📊
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={datosParaGraficos}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Dependencia" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="TotalPagos" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    )}
  </div>
);

        <Paper sx={{ p: 2, mt: 4 }}>
          <Box sx={{ height: 500, width: '100%' }}>
            <DataGrid rows={filteredData} columns={columns} getRowId={(row, index) => index} />
          </Box>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" color="primary" startIcon={<Download />} onClick={exportToExcel}>
              Exportar a Excel
            </Button>
          </Box>
        </Paper>

        <Paper sx={{ p: 2, mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Gráfica de Pagos por Fecha
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="FECHA" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="PAGO" stroke="#1b5e20" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}

export default App;
