import React, { useEffect, useState } from 'react';
import {
  Container,
  Fab,
  TextField,
  MenuItem,
  Typography,
  CircularProgress,
  Box,
  Paper,
  Tooltip,
} from '@mui/material';
import SaveAltIcon from '@mui/icons-material/SaveAlt';

import Layout from './components/Layout';
import UploadFile from './components/UploadFile';
import TablaArchivos from './components/TablaArchivos';
import SelectorHojas from './components/SelectorHojas';
import Filtros from './components/Filtros';
import TablaDatos from './components/TablaDatos';
import Graficos from './components/Graficos';
import ExportButtons from './components/ExportButtons';
import ResumenGeneral from './components/ResumenGeneral';
import SelectoresAgrupacion from './components/SelectoresAgrupacion';

import useArchivos from './hooks/useArchivos';
import useFiltrosAvanzado from './hooks/useFiltrosAvanzado';
import useExportaciones from './hooks/useExportaciones';

import axios from 'axios';

const API_URL = 'https://backend-flask-0rnq.onrender.com';

const App = () => {
  const {
    archivos,
    archivoSeleccionado,
    setArchivoSeleccionado,
    hojasSeleccionadas,
    setHojasSeleccionadas,
    hojasPorArchivo,
    datosPorArchivo,
    columnasPorArchivo,
    obtenerDatos,
    datosCombinados,
    setArchivos,
    cargarArchivos,
  } = useArchivos();

  const [filtros, setFiltros] = useState({});
  const [columnaAgrupar, setColumnaAgrupar] = useState('');
  const [columnaValor, setColumnaValor] = useState('');
  const [isLoadingUpload, setIsLoadingUpload] = useState(false);

  useEffect(() => {
    if (archivoSeleccionado && hojasSeleccionadas.length > 0) {
      obtenerDatos(archivoSeleccionado.nombreBackend, hojasSeleccionadas);
    }
  }, [archivoSeleccionado, hojasSeleccionadas]);

  useEffect(() => {
    if (archivoSeleccionado && hojasPorArchivo[archivoSeleccionado.nombreBackend]) {
      const hojas = hojasPorArchivo[archivoSeleccionado.nombreBackend];
      if (hojas.length > 0 && hojasSeleccionadas.length === 0) {
        setHojasSeleccionadas([hojas[0]]);
      }
    }
  }, [archivoSeleccionado, hojasPorArchivo]);

  const datos = datosCombinados();

  const columnasSet = new Set();
  datos.forEach((row) => {
    Object.keys(row).forEach((key) => columnasSet.add(key));
  });
  const columnas = Array.from(columnasSet);

  const columnasFecha = columnas.filter((col) =>
    col.toLowerCase().includes('fecha')
  );
  const columnasNumericas = columnas.filter((col) =>
    col.toLowerCase().match(/pago|valor|deducci|oblig|monto|total|suma|saldo/)
  );

  useEffect(() => {
    if (columnas.length > 0 && !columnaAgrupar) {
      setColumnaAgrupar(columnas[0]);
    }
    if (columnasNumericas.length > 0 && !columnaValor) {
      setColumnaValor(columnasNumericas[0]);
    }
  }, [columnas, columnasNumericas]);

  const valoresUnicos = {};
  columnas.forEach((col) => {
    const valores = datos
      .map((row) => row[col])
      .filter((v) => v !== undefined && v !== null);
    valoresUnicos[col] = [...new Set(valores)];
  });

  const texto = filtros.busqueda || '';
  const fechaInicio = filtros.Fecha_desde || '';
  const fechaFin = filtros.Fecha_hasta || '';

  const filtrosColumnas = Object.fromEntries(
    Object.entries(filtros).filter(
      ([key]) =>
        !['busqueda', 'Fecha_desde', 'Fecha_hasta'].includes(key)
    )
  );

  const pagosMin = filtros[`${columnaValor}_min`] || '';
  const pagosMax = filtros[`${columnaValor}_max`] || '';

  const datosFiltrados = useFiltrosAvanzado(
    datos,
    texto,
    fechaInicio,
    fechaFin,
    filtrosColumnas,
    pagosMin,
    pagosMax,
    columnaValor
  );

  const { exportToExcel } = useExportaciones();

  const handleClearFilters = () => {
    setFiltros({});
  };

  const handleExportar = () => {
    exportToExcel(datosFiltrados, columnas);
  };

  const handleArchivosSubidos = async (files) => {
    const formData = new FormData();
    for (const file of files) {
      formData.append('archivos', file);
    }

    try {
      setIsLoadingUpload(true);
      await axios.post(`${API_URL}/subir`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await cargarArchivos(files);
    } catch (error) {
      console.error('Error al subir archivos:', error);
      alert('Error al subir archivos');
    } finally {
      setIsLoadingUpload(false);
    }
  };

  return (
    <Layout
      sidebar={
        columnas.length > 0 && (
          <Filtros
            columnas={columnas}
            valoresUnicos={valoresUnicos}
            filtros={filtros}
            setFiltros={setFiltros}
            handleClearFilters={handleClearFilters}
            columnasFecha={columnasFecha}
            columnasNumericas={columnasNumericas}
            valorBusqueda={filtros.busqueda || ''}
            setValorBusqueda={(valor) =>
              setFiltros((prev) => ({ ...prev, busqueda: valor }))
            }
            columnaAgrupar={columnaAgrupar}
            setColumnaAgrupar={setColumnaAgrupar}
            columnaValor={columnaValor}
            setColumnaValor={setColumnaValor}
          />
        )
      }
    >
      {isLoadingUpload && (
        <Box display="flex" justifyContent="center" alignItems="center" my={2}>
          <CircularProgress sx={{ mr: 2 }} />
          <Typography>Subiendo archivo(s)... por favor espera</Typography>
        </Box>
      )}

      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <UploadFile onFilesUploaded={handleArchivosSubidos} />
      </Paper>

      {archivos?.length > 0 && (
        <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>📁 Archivos Cargados</Typography>
          <TablaArchivos
            archivos={archivos}
            archivoSeleccionado={archivoSeleccionado}
            onArchivoChange={setArchivoSeleccionado}
          />
          <SelectorHojas
            hojas={hojasPorArchivo[archivoSeleccionado?.nombreBackend] || []}
            hojasSeleccionadas={hojasSeleccionadas}
            setHojasSeleccionadas={setHojasSeleccionadas}
          />
        </Paper>
      )}

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>📄 Datos Filtrados</Typography>
        <TablaDatos datos={datosFiltrados} columnas={columnas} />
      </Paper>

      {datos.length > 0 && (
        <>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>🎛️ Agrupación y Métricas</Typography>
            <SelectoresAgrupacion
              columnas={columnas}
              columnaAgrupar={columnaAgrupar}
              setColumnaAgrupar={setColumnaAgrupar}
              columnaValor={columnaValor}
              setColumnaValor={setColumnaValor}
            />
            <ResumenGeneral datos={datosFiltrados} columnaValor={columnaValor} />
            {columnasNumericas.length > 0 && (
              <Container maxWidth="md" sx={{ my: 3 }}>
                <TextField
                  select
                  fullWidth
                  label="Columna a analizar (Pagos, Deducciones, etc.)"
                  value={columnaValor}
                  onChange={(e) => setColumnaValor(e.target.value)}
                >
                  {columnasNumericas.map((col) => (
                    <MenuItem key={col} value={col}>
                      {col}
                    </MenuItem>
                  ))}
                </TextField>
              </Container>
            )}
          </Paper>

          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>📊 Visualización Gráfica</Typography>
            <Graficos
              datos={datosFiltrados}
              columnas={columnas}
              columnaValor={columnaValor}
            />
          </Paper>

          <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
            <ExportButtons
              datos={datosFiltrados}
              columnas={columnas || []}
              onExport={handleExportar}
            />
          </Paper>
        </>
      )}
    </Layout>
  );
};

export default App;