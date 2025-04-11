import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Divider,
  Box,
  CircularProgress,
  CssBaseline,
  ThemeProvider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';
import UploadFile from './components/UploadFile';
import { getAvailableFiles, obtenerArchivos, obtenerHojas, obtenerDatos } from './services/api';
import theme from './theme';

function App() {
  const [archivos, setArchivos] = useState([]);
  const [archivoSeleccionado, setArchivoSeleccionado] = useState('');
  const [hojas, setHojas] = useState([]);
  const [hojaSeleccionada, setHojaSeleccionada] = useState('');
  const [datos, setDatos] = useState([]);
  const [columnas, setColumnas] = useState([]);
  const [sectores, setSectores] = useState([]);
  const [entidades, setEntidades] = useState([]);
  const [sectorSeleccionado, setSectorSeleccionado] = useState('');
  const [entidadSeleccionada, setEntidadSeleccionada] = useState('');
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const cargarArchivos = async () => {
      const archivosObtenidos = await obtenerArchivos();
      setArchivos(archivosObtenidos);
    };
    cargarArchivos();
  }, []);

  useEffect(() => {
    if (archivoSeleccionado) {
      const cargarHojas = async () => {
        const hojasObtenidas = await obtenerHojas(archivoSeleccionado);
        setHojas(hojasObtenidas);
        setHojaSeleccionada('');
        setDatos([]);
        setColumnas([]);
        setSectores([]);
        setEntidades([]);
        setSectorSeleccionado('');
        setEntidadSeleccionada('');
      };
      cargarHojas();
    }
  }, [archivoSeleccionado]);

  useEffect(() => {
    if (archivoSeleccionado && hojaSeleccionada) {
      const cargarDatos = async () => {
        setCargando(true);
        const datosObtenidos = await obtenerDatos(archivoSeleccionado, hojaSeleccionada);
        setDatos(datosObtenidos);
        if (datosObtenidos.length > 0) {
          const cols = Object.keys(datosObtenidos[0]);
          setColumnas(cols);
          const sectoresUnicos = [...new Set(datosObtenidos.map(d => d['Sector']))];
          const entidadesUnicas = [...new Set(datosObtenidos.map(d => d['Entidad']))];
          setSectores(sectoresUnicos);
          setEntidades(entidadesUnicas);
        }
        setCargando(false);
      };
      cargarDatos();
    }
  }, [archivoSeleccionado, hojaSeleccionada]);

  const datosFiltrados = datos.filter(d => {
    const coincideSector = sectorSeleccionado ? d['Sector'] === sectorSeleccionado : true;
    const coincideEntidad = entidadSeleccionada ? d['Entidad'] === entidadSeleccionada : true;
    return coincideSector && coincideEntidad;
  });

  const handleExportar = async () => {
    await exportarDatos(columnas, datosFiltrados);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ py: 5 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Análisis de Archivos Excel
        </Typography>

        <Divider sx={{ mb: 4 }} />

        <UploadFile onUploadSuccess={() => {
          obtenerArchivos().then(setArchivos);
        }} />

        <Box display="flex" flexWrap="wrap" gap={2} mb={4}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Archivo</InputLabel>
            <Select
              value={archivoSeleccionado}
              onChange={(e) => setArchivoSeleccionado(e.target.value)}
              label="Archivo"
            >
              {archivos.map((archivo, idx) => (
                <MenuItem key={idx} value={archivo}>{archivo}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }} disabled={!hojas.length}>
            <InputLabel>Hoja</InputLabel>
            <Select
              value={hojaSeleccionada}
              onChange={(e) => setHojaSeleccionada(e.target.value)}
              label="Hoja"
            >
              {hojas.map((hoja, idx) => (
                <MenuItem key={idx} value={hoja}>{hoja}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }} disabled={!sectores.length}>
            <InputLabel>Sector</InputLabel>
            <Select
              value={sectorSeleccionado}
              onChange={(e) => setSectorSeleccionado(e.target.value)}
              label="Sector"
            >
              <MenuItem value="">Todos</MenuItem>
              {sectores.map((sector, idx) => (
                <MenuItem key={idx} value={sector}>{sector}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }} disabled={!entidades.length}>
            <InputLabel>Entidad</InputLabel>
            <Select
              value={entidadSeleccionada}
              onChange={(e) => setEntidadSeleccionada(e.target.value)}
              label="Entidad"
            >
              <MenuItem value="">Todas</MenuItem>
              {entidades.map((entidad, idx) => (
                <MenuItem key={idx} value={entidad}>{entidad}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {cargando ? (
          <Box display="flex" justifyContent="center" my={5}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer component={Paper} sx={{ mb: 5 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {columnas.map((col, idx) => (
                      <TableCell key={idx}>{col}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {datosFiltrados.map((fila, idx) => (
                    <TableRow key={idx}>
                      {columnas.map((col, cidx) => (
                        <TableCell key={cidx}>{fila[col]}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box
              sx={{
                position: 'fixed',
                bottom: 30,
                right: 30,
                zIndex: 1000,
              }}
            >
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={handleExportar}
              >
                Exportar Excel
              </Button>
            </Box>
          </>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;
