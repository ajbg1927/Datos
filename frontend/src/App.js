import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Container, Typography, Divider, Button, Box, CircularProgress, Alert, CssBaseline, ThemeProvider, MenuItem, FormControl, InputLabel, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
 } from '@mui/material';
import UploadFile from './components/UploadFile';
import TablaArchivos from './components/TablaArchivos';
import TablaHojas from './components/TablaHojas';
import TablaDatos from './components/TablaDatos';
import Graficos from './components/Graficos';
import { getAvailableFiles, obtenerArchivos, obtenerHojas, obtenerDatos } from './services/api';
import theme from './theme';

function App() {
  const [archivos, setArchivos] = useState([]);
  const [archivoSeleccionado, setArchivoSeleccionado] = useState('');
  const [hojas, setHojas] = useState([]);
  const [hojaSeleccionada, setHojaSeleccionada] = useState('');
  const [datos, setDatos] = useState([]);
  const [columnas, setColumnas] = useState([]);
  const [columnasNumericas, setColumnasNumericas] = useState([]);
  const [filtros, setFiltros] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileOptions, setFileOptions] = useState([]);
  const [sheetOptions, setSheetOptions] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState('');
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selectedSector, setSelectedSector] = useState('');
  const [selectedEntidad, setSelectedEntidad] = useState('');
  const [sectores, setSectores] = useState([]);
  const [entidades, setEntidades] = useState([]);
  const [loading, setLoading] = useState(false);

  // Estados para manejar carga y errores
  const [cargandoHojas, setCargandoHojas] = useState(false);
  const [cargandoDatos, setCargandoDatos] = useState(false);
  const [error, setError] = useState('');

  // Cargar archivos disponibles al montar
  useEffect(() => {
    axios.get('https://backend-flask-0rnq.onrender.com/files')
      .then(response => setFileOptions(response.data.files))
      .catch(error => console.error('Error fetching files:', error));
  }, []);

  const handleFileChange = (event) => {
    const fileName = event.target.value;
    setSelectedFile(fileName);
    setSelectedSheet('');
    setData([]);
    setColumns([]);
    setSelectedSector('');
    setSelectedEntidad('');

    axios.get(`https://backend-flask-0rnq.onrender.com/sheets/${fileName}`)
      .then(response => setSheetOptions(response.data.sheets))
      .catch(error => console.error('Error fetching sheets:', error));
  };

  const handleSheetChange = (event) => {
    const sheetName = event.target.value;
    setSelectedSheet(sheetName);
    setSelectedSector('');
    setSelectedEntidad('');
    setLoading(true);

    axios.get(`https://backend-flask-0rnq.onrender.com/data/${selectedFile}/${sheetName}`)
      .then(response => {
        const { columns, data } = response.data;
        setColumns(columns);
        setData(data);

        const sectorIndex = columns.findIndex(col => col.toLowerCase().includes('sector'));
        const entidadIndex = columns.findIndex(col => col.toLowerCase().includes('entidad'));

        if (sectorIndex !== -1) {
          const uniqueSectores = [...new Set(data.map(row => row[sectorIndex]))];
          setSectores(uniqueSectores);
        }

        if (entidadIndex !== -1) {
          const uniqueEntidades = [...new Set(data.map(row => row[entidadIndex]))];
          setEntidades(uniqueEntidades);
        }
      })
      .catch(error => console.error('Error fetching data:', error))
      .finally(() => setLoading(false));
  };

  const filteredData = data.filter(row => {
    const sectorIndex = columns.findIndex(col => col.toLowerCase().includes('sector'));
    const entidadIndex = columns.findIndex(col => col.toLowerCase().includes('entidad'));

    const matchesSector = selectedSector ? row[sectorIndex] === selectedSector : true;
    const matchesEntidad = selectedEntidad ? row[entidadIndex] === selectedEntidad : true;

    return matchesSector && matchesEntidad;
  });

  const handleExport = () => {
    const exportData = {
      columns,
      data: filteredData
    };

    axios.post('https://backend-flask-0rnq.onrender.com/export', exportData, {
      responseType: 'blob',
    })
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'filtered_data.xlsx');
        document.body.appendChild(link);
        link.click();
      })
      .catch(error => console.error('Error exporting data:', error));
  };

  return (
    <Container maxWidth="xl" sx={{ py: 5 }}>
      <Typography variant="h3" align="center" gutterBottom sx={{ color: 'black', fontWeight: 'bold' }}>
        Análisis de archivos Excel
      </Typography>

      <Box display="flex" flexWrap="wrap" justifyContent="center" gap={2} my={4}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Archivo</InputLabel>
          <Select value={selectedFile || ''} onChange={handleFileChange} label="Archivo">
            {fileOptions.map((file, index) => (
              <MenuItem key={index} value={file}>{file}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }} disabled={!selectedFile}>
          <InputLabel>Hoja</InputLabel>
          <Select value={selectedSheet || ''} onChange={handleSheetChange} label="Hoja">
            {sheetOptions.map((sheet, index) => (
              <MenuItem key={index} value={sheet}>{sheet}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }} disabled={!sectores.length}>
          <InputLabel>Sector</InputLabel>
          <Select value={selectedSector} onChange={(e) => setSelectedSector(e.target.value)} label="Sector">
            <MenuItem value="">Todos</MenuItem>
            {sectores.map((sector, index) => (
              <MenuItem key={index} value={sector}>{sector}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }} disabled={!entidades.length}>
          <InputLabel>Entidad</InputLabel>
          <Select value={selectedEntidad} onChange={(e) => setSelectedEntidad(e.target.value)} label="Entidad">
            <MenuItem value="">Todas</MenuItem>
            {entidades.map((entidad, index) => (
              <MenuItem key={index} value={entidad}>{entidad}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          onClick={handleExport}
          disabled={!filteredData.length}
          startIcon={<DownloadIcon />}
        >
          Exportar Excel
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        filteredData.length > 0 && (
          <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  {columns.map((col, index) => (
                    <TableCell key={index} sx={{ fontWeight: 'bold' }}>{col}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <TableCell key={cellIndex}>{cell}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )
      )}
    </Container>
  );
}

export default App;