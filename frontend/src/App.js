import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Container, Typography, Box, Button, Grid, TextField, Accordion, AccordionSummary, AccordionDetails, MenuItem } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { saveAs } from 'file-saver';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  const [archivos, setArchivos] = useState([]);
  const [datosPorArchivo, setDatosPorArchivo] = useState({});
  const [archivoSeleccionado, setArchivoSeleccionado] = useState('');
  const [hojaSeleccionada, setHojaSeleccionada] = useState('');
  const [datos, setDatos] = useState([]);
  const [filtrados, setFiltrados] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    dependencia: '',
    startDate: null,
    endDate: null,
    pagoMin: '',
    pagoMax: ''
  });

  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    setArchivos(prev => [...prev, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        const hojas = workbook.SheetNames.map(sheet => ({
          nombre: sheet,
          datos: XLSX.utils.sheet_to_json(workbook.Sheets[sheet], { defval: '' })
        }));

        setDatosPorArchivo(prev => ({
          ...prev,
          [file.name]: hojas
        }));

        if (!archivoSeleccionado) {
          setArchivoSeleccionado(file.name);
          setHojaSeleccionada(hojas[0]?.nombre);
          setDatos(hojas[0]?.datos || []);
          setFiltrados(hojas[0]?.datos || []);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  };

  useEffect(() => {
    if (archivoSeleccionado && hojaSeleccionada && datosPorArchivo[archivoSeleccionado]) {
      const hoja = datosPorArchivo[archivoSeleccionado].find(h => h.nombre === hojaSeleccionada);
      setDatos(hoja?.datos || []);
      setFiltrados(hoja?.datos || []);
    }
  }, [archivoSeleccionado, hojaSeleccionada, datosPorArchivo]);

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  useEffect(() => {
    let tempData = [...datos];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      tempData = tempData.filter(row =>
        Object.values(row).some(val => String(val).toLowerCase().includes(searchLower))
      );
    }

    if (filters.dependencia) {
      tempData = tempData.filter(row =>
        String(row['Dependencia']).toLowerCase() === filters.dependencia.toLowerCase()
      );
    }

    if (filters.startDate && filters.endDate) {
      tempData = tempData.filter(row => {
        const fecha = new Date(row['Fecha']);
        return fecha >= filters.startDate && fecha <= filters.endDate;
      });
    }

    if (filters.pagoMin) {
      tempData = tempData.filter(row => parseFloat(row['Pago']) >= parseFloat(filters.pagoMin));
    }

    if (filters.pagoMax) {
      tempData = tempData.filter(row => parseFloat(row['Pago']) <= parseFloat(filters.pagoMax));
    }

    setFiltrados(tempData);
  }, [filters, datos]);

  const exportarExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filtrados);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Filtrados');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'datos_filtrados.xlsx');
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Header />

      <Container>
        <Box my={2}>
          <input type="file" multiple onChange={handleUpload} />
        </Box>

        {/* Archivos */}
        {archivos.length > 0 && (
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Archivos cargados</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {archivos.map(file => (
                <Button
                  key={file.name}
                  variant={file.name === archivoSeleccionado ? 'contained' : 'outlined'}
                  onClick={() => setArchivoSeleccionado(file.name)}
                  sx={{ m: 1 }}
                >
                  {file.name}
                </Button>
              ))}
            </AccordionDetails>
          </Accordion>
        )}

        {/* Hojas */}
        {archivoSeleccionado && datosPorArchivo[archivoSeleccionado] && (
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Selecciona una hoja</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {datosPorArchivo[archivoSeleccionado].map((hoja) => (
                <Button
                  key={hoja.nombre}
                  variant={hoja.nombre === hojaSeleccionada ? 'contained' : 'outlined'}
                  onClick={() => setHojaSeleccionada(hoja.nombre)}
                  sx={{ m: 1 }}
                >
                  {hoja.nombre}
                </Button>
              ))}
            </AccordionDetails>
          </Accordion>
        )}

        {/* Filtros */}
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12} md={6}><TextField fullWidth label="Buscar global" value={filters.search} onChange={(e) => handleFilterChange('search', e.target.value)} /></Grid>
          <Grid item xs={12} md={6}><TextField fullWidth label="Dependencia" value={filters.dependencia} onChange={(e) => handleFilterChange('dependencia', e.target.value)} /></Grid>
          <Grid item xs={6} md={3}><DatePicker label="Fecha inicio" value={filters.startDate} onChange={(date) => handleFilterChange('startDate', date)} renderInput={(params) => <TextField {...params} fullWidth />} /></Grid>
          <Grid item xs={6} md={3}><DatePicker label="Fecha fin" value={filters.endDate} onChange={(date) => handleFilterChange('endDate', date)} renderInput={(params) => <TextField {...params} fullWidth />} /></Grid>
          <Grid item xs={6} md={3}><TextField fullWidth label="Pago mínimo" value={filters.pagoMin} onChange={(e) => handleFilterChange('pagoMin', e.target.value)} /></Grid>
          <Grid item xs={6} md={3}><TextField fullWidth label="Pago máximo" value={filters.pagoMax} onChange={(e) => handleFilterChange('pagoMax', e.target.value)} /></Grid>
        </Grid>

        <Box my={2}>
          <Button variant="contained" color="success" onClick={exportarExcel}>Exportar Excel</Button>
        </Box>

        {/* Gráfico */}
        {filtrados.length > 0 && (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={filtrados.slice(0, 10)}>
              <XAxis dataKey="Dependencia" hide />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Pago" fill="#4CAF50" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Container>

      <Footer />
    </LocalizationProvider>
  );
}

export default App;



