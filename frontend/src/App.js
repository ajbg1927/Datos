import React, { useState, useEffect, useCallback } from 'react';
import { Container, Typography, Divider, Box, CircularProgress, Alert } from '@mui/material';
import UploadFile from './components/UploadFile';
import TablaArchivos from './components/TablaArchivos';
import TablaHojas from './components/TablaHojas';
import TablaDatos from './components/TablaDatos';
import Graficos from './components/Graficos';
import { getAvailableFiles, obtenerHojas, obtenerDatos } from './services/api';

function App() {
  const [archivos, setArchivos] = useState([]);
  const [archivoSeleccionado, setArchivoSeleccionado] = useState('');
  const [hojas, setHojas] = useState([]);
  const [hojaSeleccionada, setHojaSeleccionada] = useState('');
  const [datos, setDatos] = useState([]);
  const [columnas, setColumnas] = useState([]);
  const [columnasNumericas, setColumnasNumericas] = useState([]);
  const [filtros, setFiltros] = useState({});

  // Estados para manejar carga y errores
  const [cargandoHojas, setCargandoHojas] = useState(false);
  const [cargandoDatos, setCargandoDatos] = useState(false);
  const [error, setError] = useState('');

  // Cargar lista de archivos al iniciar
  useEffect(() => {
    const cargarArchivos = async () => {
      try {
        const archivosObtenidos = await obtenerArchivos();
        setArchivos(archivosObtenidos);
      } catch (e) {
        setError('Error al obtener archivos.');
      }
    };
    cargarArchivos();
  }, []);

  // Cargar hojas al seleccionar un archivo
  useEffect(() => {
    if (archivoSeleccionado) {
      const cargarHojas = async () => {
        setCargandoHojas(true);
        setError('');
        try {
          const hojasObtenidas = await obtenerHojas(archivoSeleccionado);
          setHojas(hojasObtenidas);
          setHojaSeleccionada('');
          setDatos([]);
          setColumnas([]);
          setColumnasNumericas([]);
        } catch (e) {
          setError('Error al obtener hojas del archivo.');
        } finally {
          setCargandoHojas(false);
        }
      };
      cargarHojas();
    }
  }, [archivoSeleccionado]);

  // Cargar datos al seleccionar hoja
  useEffect(() => {
    if (archivoSeleccionado && hojaSeleccionada) {
      const cargarDatos = async () => {
        setCargandoDatos(true);
        setError('');
        try {
          const datosObtenidos = await obtenerDatos(archivoSeleccionado, hojaSeleccionada);
          if (datosObtenidos.length > 0) {
            setDatos(datosObtenidos);
            const columnasExtraidas = Object.keys(datosObtenidos[0]);
            setColumnas(columnasExtraidas);
            const numericas = columnasExtraidas.filter(col =>
              datosObtenidos.every(row => !isNaN(parseFloat(row[col])) && isFinite(row[col]))
            );
            setColumnasNumericas(numericas);
          } else {
            setDatos([]);
            setColumnas([]);
            setColumnasNumericas([]);
            setError('La hoja seleccionada no contiene datos.');
          }
        } catch (e) {
          setError('Error al obtener datos de la hoja.');
        } finally {
          setCargandoDatos(false);
        }
      };
      cargarDatos();
    }
  }, [archivoSeleccionado, hojaSeleccionada]);

  // Aplicar filtros
  const datosFiltrados = datos.filter(row =>
    Object.entries(filtros).every(([col, valor]) =>
      valor ? String(row[col]).toLowerCase().includes(valor.toLowerCase()) : true
    )
  );

  // Callbacks
  const handleArchivoSeleccionado = useCallback(nombre => {
    setArchivoSeleccionado(nombre);
  }, []);

  const handleHojaSeleccionada = useCallback(nombreHoja => {
    setHojaSeleccionada(nombreHoja);
  }, []);

  const handleFiltros = useCallback(nuevosFiltros => {
    setFiltros(nuevosFiltros);
  }, []);

  const handleNuevoArchivo = useCallback(async () => {
    const archivosActualizados = await obtenerArchivos();
    setArchivos(archivosActualizados);
  }, []);

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Análisis de Archivos Excel
      </Typography>

      <Divider sx={{ mb: 4 }} />

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <UploadFile onUploadSuccess={handleNuevoArchivo} />

      <TablaArchivos
        archivos={archivos}
        onArchivoSeleccionado={handleArchivoSeleccionado}
        archivoSeleccionado={archivoSeleccionado}
      />

      {cargandoHojas && <Box sx={{ mt: 2, textAlign: 'center' }}><CircularProgress /></Box>}

      {!cargandoHojas && hojas.length > 0 && (
        <TablaHojas
          hojas={hojas}
          onHojaSeleccionada={handleHojaSeleccionada}
          hojaSeleccionada={hojaSeleccionada}
        />
      )}

      {cargandoDatos && <Box sx={{ mt: 4, textAlign: 'center' }}><CircularProgress /></Box>}

      {!cargandoDatos && datos.length > 0 && (
        <>
          <TablaDatos
            datos={datosFiltrados}
            columnas={columnas}
            columnasNumericas={columnasNumericas}
            onFiltroChange={handleFiltros}
          />
          <Box sx={{ mt: 4 }}>
            <Graficos
              datos={datosFiltrados}
              columnasNumericas={columnasNumericas}
            />
          </Box>
        </>
      )}
    </Container>
  );
}

export default App;