import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
    Box, CircularProgress, Paper, Tab, Tabs, Typography, TextField, Divider
} from '@mui/material';

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
import FiltroDependencia from './components/FiltroDependencia';

import useArchivos from './hooks/useArchivos';
import useFiltrosAvanzado from './hooks/useFiltrosAvanzado';
import useExportaciones from './hooks/useExportaciones';
import useGraficos from './hooks/useGraficos'
import axios from 'axios';

const API_URL = 'https://backend-flask-u76y.onrender.com';

const App = () => {
    const {
        archivos,
        setArchivos,
        archivoSeleccionado,
        setArchivoSeleccionado: setArchivoSeleccionadoFromHook,
        hojasSeleccionadas,
        setHojasSeleccionadas: setHojasSeleccionadasFromHook,
        hojasPorArchivo,
        datosPorArchivo: datosPorArchivoHook,
        columnasPorArchivo: columnasPorArchivoHook,
        obtenerDatos, 
        cargarArchivos,
        obtenerHojas,
        cargandoDatos: cargandoDatosHook,
    } = useArchivos();

    const [filtros, setFiltros] = useState({});
    const [columnaAgrupar, setColumnaAgrupar] = useState('');
    const [columnaValor, setColumnaValor] = useState('');
    const [isLoadingUpload, setIsLoadingUpload] = useState(false);
    const [tipoGrafico, setTipoGrafico] = useState('Barras');
    const [paleta, setPaleta] = useState('Institucional');
    const [ordenarGrafico, setOrdenarGrafico] = useState(true);
    const [topNGrafico, setTopNGrafico] = useState(10);
    const [mostrarPorcentajeBarras, setMostrarPorcentajeBarras] = useState(false);
    const [tabValue, setTabValue] = useState(0);
    const [resultadosProcesadosPorHoja, setResultadosProcesadosPorHoja] = useState(null);
    const [ticProcesado, setTicProcesado] = useState(false);
    const [datosCombinadosApp, setDatosCombinadosApp] = useState([]);
    const [cargandoProcesamiento, setCargandoProcesamiento] = useState(false);

    const [datosFiltrados, setDatosFiltrados] = useState([]);
    const [dependenciasPorHoja, setDependenciasPorHoja] = useState({});
    const [hojaSeleccionada, setHojaSeleccionada] = useState('');
    const [dependenciaSeleccionada, setDependenciaSeleccionada] = useState('');
    const [columnas, setColumnas] = useState([]);
    const [columnasEstablecidas, setColumnasEstablecidas] = useState(false);

    const handleArchivoSeleccionadoChange = useCallback((archivo) => {
        setArchivoSeleccionadoFromHook(archivo);
        setHojasSeleccionadasFromHook([]);
    }, [setArchivoSeleccionadoFromHook, setHojasSeleccionadasFromHook]);

    const handleHojasSeleccionadasChange = useCallback((hojas) => {
        setHojasSeleccionadasFromHook(hojas);
    }, [setHojasSeleccionadasFromHook]);

    useEffect(() => {
    obtenerArchivos();
  }, [obtenerArchivos]);

  useEffect(() => {
    if (archivoSeleccionado && hojasSeleccionadas.length > 0) {
      obtenerDatos(archivoSeleccionado.nombreBackend, hojasSeleccionadas)
        .then((data) => {
          if (data) {
            setDatosCombinadosApp(data);
            console.log("DatosCombinadosApp después de obtenerDatos:");
            console.table(data); // 💥 Mejor visualización
            if (data.length > 0) {
              setColumnas(Object.keys(data[0]));
              setColumnasEstablecidas(true);
              console.log("Columnas iniciales seteadas:", Object.keys(data[0]));
            }
          }
        })
        .catch(console.error);
    } else {
      setColumnasEstablecidas(false);
      setDatosCombinadosApp([]);
      setColumnas([]);
    }
  }, [archivoSeleccionado, hojasSeleccionadas, obtenerDatos]);

  useEffect(() => {
    if (archivoSeleccionado && !hojasPorArchivo[archivoSeleccionado.nombreBackend]) {
      obtenerHojas(archivoSeleccionado.nombreBackend);
    }
  }, [archivoSeleccionado, obtenerHojas, hojasPorArchivo]);

  useEffect(() => {
    console.log("datosFiltrados cambiaron:");
    console.table(datosFiltrados);
  }, [datosFiltrados]);

  const columnasFecha = useMemo(
    () => columnas.filter((col) => col.toLowerCase().includes("fecha")),
    [columnas]
  );

  const handleFiltrar = (filtrosAplicados) => {
    setFiltros(filtrosAplicados);
    const datosFiltrados = datosCombinadosApp.filter((fila) =>
      Object.entries(filtrosAplicados).every(([columna, valor]) => {
        if (!valor) return true;
        return fila[columna]?.toString().toLowerCase().includes(valor.toLowerCase());
      })
    );
    setDatosFiltrados(datosFiltrados);
  };

  useEffect(() => {
    if (datosCombinadosApp.length > 0) {
      setDatosFiltrados(datosCombinadosApp);
    }
  }, [datosCombinadosApp]);

  return (
    <Layout
      sidebar={
        <>
          <SelectorArchivo
            archivos={archivos}
            onArchivoSeleccionado={(archivo) => {
              setArchivoSeleccionado(archivo);
              setHojasSeleccionadas([]);
              setDependenciaSeleccionada("");
            }}
            archivoSeleccionado={archivoSeleccionado}
          />
          <SelectorHojas
            hojas={archivoSeleccionado ? hojasPorArchivo[archivoSeleccionado.nombreBackend] || [] : []}
            onSeleccionarHojas={setHojasSeleccionadas}
            hojasSeleccionadas={hojasSeleccionadas}
          />
          <SelectorDependencia
            datos={datosCombinadosApp}
            dependenciaSeleccionada={dependenciaSeleccionada}
            setDependenciaSeleccionada={setDependenciaSeleccionada}
            setDatosFiltrados={setDatosFiltrados}
          />
          <FiltrosDinamicos
            columnas={columnas}
            onFiltrar={handleFiltrar}
            columnasFecha={columnasFecha}
          />
        </>
      }
    >
      {datosFiltrados.length > 0 && columnas.length > 0 && (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Resultados
          </Typography>
          <TablaDatos
            key={`tabla-datos-${datosFiltrados.length}`}
            datosIniciales={datosFiltrados}
            columnasDefinidas={columnas}
          />
        </Paper>
      )}
      {datosFiltrados.length > 0 && (
        <ExportarExcel datos={datosFiltrados} nombreArchivo="datos_filtrados" />
      )}
    </Layout>
  );
}

export default App;