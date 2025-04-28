import { useState, useMemo } from 'react';
import { combinarDatosArchivos, obtenerColumnasUnicas, obtenerColumnasNumericas, obtenerColumnasFecha, obtenerValoresUnicosPorColumna } from '../services/processingHelpers';
const useProcesamientoDatos = () => {
  const [archivos, setArchivos] = useState([]);
  const [datosPorArchivo, setDatosPorArchivo] = useState({});
  const [nombreArchivos, setNombreArchivos] = useState([]);

  const datosCombinadosApp = useMemo(() => {
    if (!datosPorArchivo || Object.keys(datosPorArchivo).length === 0) return [];
    return combinarDatosArchivos(datosPorArchivo);
  }, [datosPorArchivo]);

  const columnas = useMemo(() => {
    return obtenerColumnasUnicas(datosCombinadosApp);
  }, [datosCombinadosApp]);

  const columnasNumericas = useMemo(() => {
    return obtenerColumnasNumericas(datosCombinadosApp, columnas);
  }, [datosCombinadosApp, columnas]);

  const columnasFecha = useMemo(() => {
    return obtenerColumnasFecha(datosCombinadosApp, columnas);
  }, [datosCombinadosApp, columnas]);

  const valoresUnicos = useMemo(() => {
    return obtenerValoresUnicosPorColumna(datosCombinadosApp, columnas);
  }, [datosCombinadosApp, columnas]);

  const handleArchivosSubidos = (archivosCargados) => {
    setArchivos(archivosCargados);
    setNombreArchivos(archivosCargados.map((archivo) => archivo.name));
  };

  const handleProcesarDatos = (datosParseadosPorArchivo) => {
    setDatosPorArchivo(datosParseadosPorArchivo);
  };

  return {
    archivos,
    nombreArchivos,
    datosPorArchivo,
    datosCombinadosApp,
    columnas,
    columnasNumericas,
    columnasFecha,
    valoresUnicos,
    handleArchivosSubidos,
    handleProcesarDatos,
  };
};

export default useProcesamientoDatos;