import React, { useState } from "react";
import { Tabs, Tab, Box, Button, Typography, TextField } from "@mui/material";
import CargaArchivo from "./components/CargaArchivo";
import TablaDatos from "./components/TablaDatos";
import Graficos from "./components/Graficos";
import ExportarDatos from "./components/ExportarDatos";
import FiltrosDinamicos from "./components/FiltrosDinamicos";
import ProcesarTIC from "./components/ProcesarTIC";
import AnalisisGeneral from "./components/AnalisisGeneral";

const App = () => {
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
  const [datosExcel, setDatosExcel] = useState([]);
  const [columnas, setColumnas] = useState([]);
  const [filtros, setFiltros] = useState({});
  const [datosFiltrados, setDatosFiltrados] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [columnaAgrupar, setColumnaAgrupar] = useState("");
  const [columnaValor, setColumnaValor] = useState("");
  const [hojasSeleccionadas, setHojasSeleccionadas] = useState([]);
  const [resultadosProcesadosPorHoja, setResultadosProcesadosPorHoja] = useState({});
  const [ticProcesado, setTicProcesado] = useState(false);

  const handleArchivoSeleccionado = (archivo) => {
    setArchivoSeleccionado(archivo);
    setTicProcesado(false);
  };

  const handleDatosExcel = (datos, columnas) => {
    setDatosExcel(datos);
    setColumnas(columnas);
    setDatosFiltrados(datos);
    setFiltros({});
  };

  const handleFiltros = (filtrosActualizados) => {
    setFiltros(filtrosActualizados);
    filtrarDatos(datosExcel, filtrosActualizados);
  };

  const filtrarDatos = (datos, filtros) => {
    const datosFiltrados = datos.filter((fila) =>
      Object.entries(filtros).every(([columna, valor]) => {
        if (!valor) return true;
        return fila[columna] === valor;
      })
    );
    setDatosFiltrados(datosFiltrados);
  };

  const handleChangeTab = (event, newValue) => {
    try {
      console.log("handleChangeTab - Nuevo valor:", newValue);
      setTabValue(newValue);
      if ((newValue === 4 || newValue === 5) && archivoSeleccionado && hojasSeleccionadas.length > 0 && !ticProcesado) {
        handleProcesarDatos();
        setTicProcesado(true);
      }
    } catch (error) {
      console.error('Error cambiando pestaña:', error);
    }
  };

  const handleProcesarDatos = async () => {
    try {
      console.log("Procesando datos TIC...");
      const resultados = {};
      for (const hoja of hojasSeleccionadas) {
        const procesado = await ProcesarTIC(archivoSeleccionado, hoja);
        resultados[hoja] = procesado;
      }
      setResultadosProcesadosPorHoja(resultados);
      console.log("Datos TIC procesados:", resultados);
    } catch (error) {
      console.error('Error procesando datos TIC:', error);
    }
  };

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        Análisis de Datos Excel
      </Typography>
      
      <Tabs value={tabValue} onChange={handleChangeTab}>
        <Tab label="Cargar Archivo" />
        <Tab label="Filtrar Datos" />
        <Tab label="Visualizar Tabla" />
        <Tab label="Graficar Datos" />
        <Tab label="Tablas Procesadas" />
        <Tab label="Análisis General" />
      </Tabs>

      <Box mt={2}>
        {tabValue === 0 && (
          <CargaArchivo
            onArchivoSeleccionado={handleArchivoSeleccionado}
            onDatosCargados={handleDatosExcel}
            onHojasSeleccionadas={setHojasSeleccionadas}
          />
        )}

        {tabValue === 1 && (
          <>
            <FiltrosDinamicos columnas={columnas} onFiltrosActualizados={handleFiltros} />
            <TablaDatos datos={datosFiltrados} columnas={columnas} />
          </>
        )}

        {tabValue === 2 && (
          <TablaDatos datos={datosFiltrados} columnas={columnas} />
        )}

        {tabValue === 3 && (
          <>
            <TextField
              label="Agrupar por"
              value={columnaAgrupar}
              onChange={(e) => setColumnaAgrupar(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Valor numérico"
              value={columnaValor}
              onChange={(e) => setColumnaValor(e.target.value)}
              fullWidth
              margin="normal"
            />
            {columnaAgrupar && columnaValor && datosFiltrados.length > 0 ? (
              <Graficos
                datos={datosFiltrados}
                columnaAgrupacion={columnaAgrupar}
                columnaValor={columnaValor}
              />
            ) : (
              <Typography variant="body1">Seleccione las columnas de agrupación y valor.</Typography>
            )}
          </>
        )}

        {tabValue === 4 && (
          <>
            {Object.keys(resultadosProcesadosPorHoja).length > 0 ? (
              <>
                {Object.entries(resultadosProcesadosPorHoja).map(([hoja, datos]) => (
                  <Box key={hoja} mb={4}>
                    <Typography variant="h6">Resultados de {hoja}</Typography>
                    <TablaDatos datos={datos} columnas={Object.keys(datos[0] || {})} />
                  </Box>
                ))}
              </>
            ) : (
              <Typography variant="body1">No se encontraron resultados procesados.</Typography>
            )}
          </>
        )}

        {tabValue === 5 && (
          <>
            {Object.keys(resultadosProcesadosPorHoja).length > 0 ? (
              <>
                <Typography variant="h6">Análisis General TIC</Typography>
                {Object.entries(resultadosProcesadosPorHoja).map(([hoja, datos]) => (
                  <Box key={hoja} mb={4}>
                    <Typography variant="subtitle1">Resultados de {hoja}</Typography>
                    <AnalisisGeneral datos={datos} />
                  </Box>
                ))}
              </>
            ) : (
              <Typography variant="body1">No hay datos para el análisis general.</Typography>
            )}
          </>
        )}
      </Box>

      <Box mt={2}>
        <ExportarDatos datos={datosFiltrados} />
      </Box>
    </Box>
  );
};

export default App;