import React, { useState, useEffect, useCallback } from 'react';
import { Container, Typography, Divider, Box } from '@mui/material';
import UploadFile from './components/UploadFile';
import TablaArchivos from './components/TablaArchivos';
import TablaHojas from './components/TablaHojas';
import TablaDatos from './components/TablaDatos';
import Graficos from './components/graficos';
import { obtenerArchivos, obtenerHojas, obtenerDatos } from './services/api';

function App() {
  const [archivos, setArchivos] = useState([]);
  const [archivoSeleccionado, setArchivoSeleccionado] = useState('');
  const [hojas, setHojas] = useState([]);
  const [hojaSeleccionada, setHojaSeleccionada] = useState('');
  const [datos, setDatos] = useState([]);
  const [columnas, setColumnas] = useState([]);
  const [columnasNumericas, setColumnasNumericas] = useState([]);
  const [filtros, setFiltros] = useState({});

  // Obtener archivos al cargar la app
  useEffect(() => {
    const cargarArchivos = async () => {
      const archivosObtenidos = await obtenerArchivos();
      setArchivos(archivosObtenidos);
    };
    cargarArchivos();
  }, []);

  // Obtener hojas cuando se selecciona un archivo
  useEffect(() => {
    if (archivoSeleccionado) {
      const cargarHojas = async () => {
        const hojasObtenidas = await obtenerHojas(archivoSeleccionado);
        setHojas(hojasObtenidas);
        setHojaSeleccionada('');
        setDatos([]);
      };
      cargarHojas();
    }
  }, [archivoSeleccionado]);

  // Obtener datos cuando se selecciona una hoja
  useEffect(() => {
    if (archivoSeleccionado && hojaSeleccionada) {
      const cargarDatos = async () => {
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
        }
      };
      cargarDatos();
    }
  }, [archivoSeleccionado, hojaSeleccionada]);

  // Manejo del filtrado
  const datosFiltrados = datos.filter(row =>
    Object.entries(filtros).every(([col, valor]) =>
      valor ? String(row[col]).toLowerCase().includes(valor.toLowerCase()) : true
    )
  );

  // Callbacks para manejar eventos de componentes hijos
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

      <UploadFile onUploadSuccess={handleNuevoArchivo} />

      <TablaArchivos
        archivos={archivos}
        onArchivoSeleccionado={handleArchivoSeleccionado}
        archivoSeleccionado={archivoSeleccionado}
      />

      {hojas.length > 0 && (
        <TablaHojas
          hojas={hojas}
          onHojaSeleccionada={handleHojaSeleccionada}
          hojaSeleccionada={hojaSeleccionada}
        />
      )}

      {datos.length > 0 && (
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