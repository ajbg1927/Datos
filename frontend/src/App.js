import React, { useEffect, useState } from 'react';
import {
    Container,
    TextField,
    MenuItem,
    Typography,
    CircularProgress,
    Box,
    Paper,
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

import useArchivos from './hooks/useArchivos';
import useFiltrosAvanzado from './hooks/useFiltrosAvanzado';
import useExportaciones from './hooks/useExportaciones';
import axios from 'axios';

const API_URL = 'https://backend-flask-u76y.onrender.com';

const App = () => {
    const {
        archivos,
        setArchivos,
        archivoSeleccionado,
        setArchivoSeleccionado,
        hojasSeleccionadas,
        setHojasSeleccionadas,
        hojasPorArchivo,
        datosPorArchivo,
        columnasPorArchivo,
        obtenerDatos,
        datosCombinados,
        cargarArchivos,
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

    const [resultadosProcesados, setResultadosProcesados] = useState(null); // Nuevo estado

    useEffect(() => {
        const procesar = async () => {
            if (archivoSeleccionado && hojasSeleccionadas.length > 0) {
                await obtenerDatos(archivoSeleccionado.nombreBackend, hojasSeleccionadas);

                const formData = new FormData();
                formData.append('archivo', archivoSeleccionado.archivo);
                formData.append('hoja', hojasSeleccionadas[0]);
                formData.append('dependencia', 'DIRECCION DE LAS TIC');

                try {
                    const response = await axios.post(`${API_URL}/procesar_excel`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });

                    const resultados = response.data;
                    setResultadosProcesados(resultados);
                    console.log('Resultados procesados:', resultados);
                } catch (error) {
                    console.error('Error al procesar los datos:', error);
                }
            }
        };
        procesar();
    }, [archivoSeleccionado, hojasSeleccionadas]);

    useEffect(() => {
        if (archivoSeleccionado && hojasPorArchivo[archivoSeleccionado.nombreBackend]) {
            const hojas = hojasPorArchivo[archivoSeleccionado.nombreBackend];
            if (hojas.length > 0 && hojasSeleccionadas.length === 0) {
                setHojasSeleccionadas([hojas[0]]);
            }
        }
    }, [archivoSeleccionado, hojasPorArchivo, setHojasSeleccionadas]);

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
    }, [columnas, columnasNumericas, columnaAgrupar, setColumnaAgrupar, columnaValor, setColumnaValor]);

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

    const { exportToExcel, exportToCSV, exportToPDF, exportToTXT } = useExportaciones();

    const handleClearFilters = () => {
        setFiltros({});
    };

    const handleExportar = (formato) => {
        switch (formato) {
            case 'excel':
                exportToExcel(datosFiltrados, columnas);
                break;
            case 'csv':
                exportToCSV(datosFiltrados, columnas);
                break;
            case 'pdf':
                exportToPDF(datosFiltrados, columnas);
                break;
            case 'txt':
                exportToTXT(datosFiltrados, columnas);
                break;
            default:
                exportToExcel(datosFiltrados, columnas);
                break;
        }
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
                <Paper elevation={1} sx={{ p: 3, borderRadius: 3, backgroundColor: 'white' }}>
                    {columnas.length > 0 ? (
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
                    ) : (
                        <Typography variant="body2" color="textSecondary">
                            Selecciona un archivo para ver los filtros.
                        </Typography>
                    )}
                </Paper>
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

            {resultadosProcesados && resultadosProcesados.length > 0 ? (
                <Box display="flex" flexDirection="column" gap={3}>
                    {resultadosProcesados.map((tabla, index) => (
                        <Paper elevation={2} sx={{ p: 3 }} key={index}>
                            <Typography variant="h6" gutterBottom>
                                📄 {tabla.nombre || `Tabla ${index + 1}`}
                            </Typography>
                            {tabla.data && tabla.data.length > 0 ? (
                                <TablaDatos datos={tabla.data} columnas={tabla.headers || Object.keys(tabla.data[0] || {})} />
                            ) : (
                                <Typography variant="body2" color="textSecondary">No hay datos en esta tabla.</Typography>
                            )}
                        </Paper>
                    ))}
                    <Paper elevation={2} sx={{ p: 2 }}>
                        <ExportButtons
                            datos={datosFiltrados} // Considerar cómo exportar múltiples tablas
                            columnas={columnas || []}
                            onExport={handleExportar}
                        />
                    </Paper>
                </Box>
            ) : datos.length > 0 && (
                <Box display="flex" flexDirection="column" gap={3}>
                    <Paper elevation={2} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            📄 Datos
                        </Typography>
                        <TablaDatos datos={datosFiltrados} columnas={columnas} />
                    </Paper>

                    <Paper elevation={2} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            📊 Análisis
                        </Typography>
                        <SelectoresAgrupacion
                            columnas={columnas}
                            columnaAgrupar={columnaAgrupar}
                            setColumnaAgrupar={setColumnaAgrupar}
                            columnaValor={columnaValor}
                            setColumnaValor={setColumnaValor}
                            tipoGrafico={tipoGrafico}
                            setTipoGrafico={setTipoGrafico}
                            paleta={paleta}
                            setPaleta={setPaleta}
                            ordenar={ordenarGrafico}
                            setOrdenar={setOrdenarGrafico}
                            topN={topNGrafico}
                            setTopN={setTopNGrafico}
                            mostrarPorcentajeBarras={mostrarPorcentajeBarras}
                            setMostrarPorcentajeBarras={setMostrarPorcentajeBarras}
                        />
                        <ResumenGeneral
                            datos={datosFiltrados}
                            columnaValor={columnaValor}
                            resultadosProcesados={resultadosProcesados}
                        />
                        <Graficos
                            datos={datosFiltrados}
                            columnaAgrupacion={columnaAgrupar}
                            columnaValor={columnaValor}
                            tipoGrafico={tipoGrafico}
                            paleta={paleta}
                            ordenar={ordenarGrafico}
                            topN={topNGrafico}
                            mostrarPorcentajeBarras={mostrarPorcentajeBarras}
                        />
                    </Paper>

                    <Paper elevation={2} sx={{ p: 2 }}>
                        <ExportButtons
                            datos={datosFiltrados}
                            columnas={columnas || []}
                            onExport={handleExportar}
                        />
                    </Paper>
                </Box>
            )}
        </Layout>
    );
};

export default App;