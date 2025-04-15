import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import {
  Container, Typography, Box, Button, Grid, TextField, MenuItem, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { saveAs } from 'file-saver';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Header from './components/Header';
import Footer from './components/Footer';


function App() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [file, setFile] = useState(null);
  const [sheetNames, setSheetNames] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [filters, setFilters] = useState({
    search: '',
    sector: '',
    entidad: '',
    startDate: null,
    endDate: null,
    pagoMin: '',
    pagoMax: ''
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      setSheetNames(workbook.SheetNames);
      setSelectedSheet(workbook.SheetNames[0]);
    };
    reader.readAsArrayBuffer(selectedFile);
  };

  const handleSheetChange = (e) => {
    setSelectedSheet(e.target.value);
  };

  useEffect(() => {
    if (file && selectedSheet) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[selectedSheet];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
        console.log("Datos cargados:", jsonData);
        setData(jsonData);
        setFilteredData(jsonData);
      };
      reader.readAsArrayBuffer(file);
    }
  }, [file, selectedSheet]);

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  useEffect(() => {
    let tempData = [...data];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      tempData = tempData.filter(row => Object.values(row).some(val => String(val).toLowerCase().includes(searchLower)));
    }

    if (filters.sector) {
      tempData = tempData.filter(row => row['Sector'] === filters.sector);
    }

    if (filters.entidad) {
      tempData = tempData.filter(row => row['Entidad'] === filters.entidad);
    }

    if (filters.startDate && filters.endDate) {
      tempData = tempData.filter(row => {
        const fecha = new Date(row['Fecha']);
        return fecha >= filters.startDate && fecha <= filters.endDate;
      });
    }

    if (filters.pagoMin) {
      tempData = tempData.filter(row => row['Pago'] >= parseFloat(filters.pagoMin));
    }

    if (filters.pagoMax) {
      tempData = tempData.filter(row => row['Pago'] <= parseFloat(filters.pagoMax));
    }

    setFilteredData(tempData);
  }, [filters, data]);

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Datos Filtrados');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, 'datos_filtrados.xlsx');
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Header />
      <Container>
        <Typography variant="h5" gutterBottom>Carga y Filtros de Datos</Typography>

        <Box my={2}>
          <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
        </Box>

        {sheetNames.length > 0 && (
          <TextField
            select
            label="Selecciona una hoja"
            value={selectedSheet}
            onChange={handleSheetChange}
            fullWidth
            margin="normal"
          >
            {sheetNames.map((name) => (
              <MenuItem key={name} value={name}>{name}</MenuItem>
            ))}
          </TextField>
        )}

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}><TextField label="Buscar" fullWidth value={filters.search} onChange={(e) => handleFilterChange('search', e.target.value)} /></Grid>
          <Grid item xs={12} md={3}><TextField label="Sector" fullWidth value={filters.sector} onChange={(e) => handleFilterChange('sector', e.target.value)} /></Grid>
          <Grid item xs={12} md={3}><TextField label="Entidad" fullWidth value={filters.entidad} onChange={(e) => handleFilterChange('entidad', e.target.value)} /></Grid>
          <Grid item xs={6} md={3}><DatePicker label="Fecha Inicio" value={filters.startDate} onChange={(date) => handleFilterChange('startDate', date)} renderInput={(params) => <TextField {...params} fullWidth />} /></Grid>
          <Grid item xs={6} md={3}><DatePicker label="Fecha Fin" value={filters.endDate} onChange={(date) => handleFilterChange('endDate', date)} renderInput={(params) => <TextField {...params} fullWidth />} /></Grid>
          <Grid item xs={6} md={3}><TextField label="Pago Mínimo" fullWidth value={filters.pagoMin} onChange={(e) => handleFilterChange('pagoMin', e.target.value)} /></Grid>
          <Grid item xs={6} md={3}><TextField label="Pago Máximo" fullWidth value={filters.pagoMax} onChange={(e) => handleFilterChange('pagoMax', e.target.value)} /></Grid>
        </Grid>

        <Box my={2}>
          <Button variant="contained" color="primary" onClick={handleExport}>Exportar Excel</Button>
        </Box>

        <Box my={2}>
          <Paper>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={filteredData.slice(0, 10)}>
                <XAxis dataKey="Entidad" hide />
                <YAxis />
                <Tooltip />
                <Bar dataKey="Pago" fill="#4CAF50" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Box>

        {/* Tabla con paginación */}
        <Box my={2}>
          <Paper>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {filteredData[0] && Object.keys(filteredData[0]).map((key) => (
                      <TableCell key={key}>{key}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => (
                    <TableRow key={i}>
                      {Object.values(row).map((value, j) => (
                        <TableCell key={j}>{value}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={filteredData.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          </Paper>
        </Box>
      </Container>
      <Footer />
    </LocalizationProvider>
  );
}

export default App;

