import React from 'react';
import {
  Container,
  Fab,
  TextField,
  MenuItem
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
import useArchivos from './hooks/useArchivos';
import useFiltrosAvanzado from './hooks/useFiltrosAvanzado';
import useExportaciones from './hooks/useExportaciones';
import axios from 'axios';

const API_URL = 'https://backend-flask-0rnq.onrender.com';

function App() {
  const {
    archivos,
    archivoSeleccionado,
    setArchivoSeleccionado,
    hojas,
    hojasSeleccionadas,
    setHojasSeleccionadas,
    datos,
    columnas,
    columnasFecha,
    columnasNumericas,
    valoresUnicos,
    setArchivos,
  } = useArchivos();

  const [filtros, setFiltros] = React.useState({});
  const [columnaValor, setColumnaValor] = React.useState('Pagos');

  const texto = filtros.busqueda || '';
  const fechaInicio = filtros.Fecha_desde || '';
  const fechaFin = filtros.Fecha_hasta || '';

  const pagosMin = filtros[`${columnaValor}_min`] || '';
  const pagosMax = filtros[`${columnaValor}_max`] || '';

  const filtrosColumnas = Object.fromEntries(
    Object.entries(filtros).filter(
      ([key]) =>
        ![
          'busqueda',
          'Fecha_desde',
          'Fecha_hasta',
          'Pagos_min',
          'Pagos_max',
          `${columnaValor}_min`,
          `${columnaValor}_max`,
        ].includes(key)
    )
  );

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

  const handleArchivosSubidos = async (files) => {
    const formData = new FormData();
    for (let file of files) {
      formData.append('file', file);
    }

    try {
      await axios.post(`${API_URL}/subir`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const res = await axios.get(`${API_URL}/archivos`);
      setArchivoSeleccionado('');
      setHojasSeleccionadas([]);
      setArchivos(res.data.archivos);
    } catch (error) {
      console.error('Error al subir archivos:', error);
      alert('Error al subir archivos');
    }
  };

  return (
    <Layout>
      <UploadFile onFilesUploaded={handleArchivosSubidos} />

      {archivos.length > 0 && (
        <>
          <TablaArchivos
            archivos={archivos}
            archivoSeleccionado={archivoSeleccionado}
            onArchivoChange={setArchivoSeleccionado}
          />
          <SelectorHojas
            hojas={hojas}
            hojasSeleccionadas={hojasSeleccionadas}
            setHojasSeleccionadas={setHojasSeleccionadas}
          />
        </>
      )}

      {columnas.length > 0 && (
        <>
          {columnasNumericas.length > 0 && (
            <TextField
              select
              fullWidth
              label="Columna a analizar (Pagos, Deducciones, etc.)"
              value={columnaValor}
              onChange={(e) => setColumnaValor(e.target.value)}
              sx={{ my: 2 }}
            >
              {columnasNumericas.map((col) => (
                <MenuItem key={col} value={col}>
                  {col}
                </MenuItem>
              ))}
            </TextField>
          )}
          <Filtros
            columnas={columnas}
            valoresUnicos={valoresUnicos}
            filtros={filtros}
            setFiltros={setFiltros}
            handleClearFilters={handleClearFilters}
            columnasFecha={columnasFecha}
            columnasNumericas={columnasNumericas}
            columnaValor={columnaValor}
          />
        </>
      )}

      <TablaDatos datos={datosFiltrados} columnas={columnas} />
      <Graficos datos={datosFiltrados} columnas={columnas} columnaValor={columnaValor} />
      <ExportButtons onExport={() => exportToExcel(datosFiltrados, columnas)} />

      <Fab
        color="primary"
        aria-label="exportar"
        onClick={() => exportToExcel(datosFiltrados, columnas)}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          backgroundColor: '#ffcd00',
          color: '#000',
          '&:hover': {
            backgroundColor: '#e6b800',
          },
        }}
      >
        <SaveAltIcon />
      </Fab>
    </Layout>
  );
}

export default App;