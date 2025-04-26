import { useState, useEffect, useMemo } from "react";
import { Layout } from "./components/Layout";
import { useArchivos } from "./hooks/useArchivos";
import { useHojas } from "./hooks/useHojas";
import { useDatos } from "./hooks/useDatos";
import { SelectorArchivo } from "./components/SelectorArchivo";
import { SelectorHojas } from "./components/SelectorHojas";
import { SelectorDependencia } from "./components/SelectorDependencia";
import { FiltrosDinamicos } from "./components/FiltrosDinamicos";
import { TablaDatos } from "./components/TablaDatos";
import { ExportarExcel } from "./components/ExportarExcel";
import { Paper, Typography } from "@mui/material";

function App() {
  const { archivos, obtenerArchivos } = useArchivos();
  const { hojasPorArchivo, obtenerHojas } = useHojas();
  const { datosCombinadosApp, setDatosCombinadosApp, obtenerDatos } = useDatos();

  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
  const [hojasSeleccionadas, setHojasSeleccionadas] = useState([]);
  const [dependenciaSeleccionada, setDependenciaSeleccionada] = useState("");
  const [columnas, setColumnas] = useState([]);
  const [columnasEstablecidas, setColumnasEstablecidas] = useState(false);
  const [datosFiltrados, setDatosFiltrados] = useState([]);
  const [filtros, setFiltros] = useState({});

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