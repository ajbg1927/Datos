import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
} from '@mui/material';
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LabelList,
} from 'recharts';
import InsertChartIcon from '@mui/icons-material/InsertChart';

const PALETAS = {
    Institucional: ['#4caf50', '#fdd835', '#ff9800', '#2196f3', '#9c27b0', '#ff5722'],
    Pastel: ['#ffd1dc', '#bae1ff', '#caffbf', '#fdffb6', '#a0c4ff', '#ffc6ff'],
    Fuego: ['#ff5722', '#ff7043', '#ff8a65', '#ffab91', '#d84315', '#bf360c'],
    Frío: ['#00bcd4', '#4dd0e1', '#80deea', '#b2ebf2', '#e0f7fa', '#006064'],
    Oceano: ['#034078', '#05668D', '#028090', '#00A896', '#02C8A9'],
};

const Graficos = ({
    datos,
    columnaAgrupacion,
    columnaValor,
    tipoGrafico,
    paleta,
    ordenar,
    topN,
    mostrarPorcentajeBarras,
}) => {
    const [dataAgrupada, setDataAgrupada] = useState([]);

    useEffect(() => {
        if (!datos || !columnaAgrupacion || !columnaValor || datos.length === 0) {
            setDataAgrupada([]);
            return;
        }

        const primerDato = datos[0];
        if (!primerDato || !(columnaAgrupacion in primerDato) || !(columnaValor in primerDato)) {
            console.error('Las columnas de agrupación o valor no existen en los datos.');
            setDataAgrupada([]);
            return;
        }

        const agrupado = {};
        datos.forEach((fila) => {
            const clave = fila[columnaAgrupacion];
            const valor = parseFloat(fila[columnaValor]) || 0;
            if (clave) agrupado[clave] = (agrupado[clave] || 0) + valor;
        });

        let nuevoData = Object.entries(agrupado).map(([key, value]) => ({
            name: key,
            value,
        }));

        if (ordenar) {
            nuevoData.sort((a, b) => b.value - a.value);
        }

        if (topN > 0 && topN < nuevoData.length) {
            nuevoData = nuevoData.slice(0, topN);
        }

        setDataAgrupada(nuevoData);
        console.log("Graficos - dataAgrupada:", nuevoData);
    }, [datos, columnaAgrupacion, columnaValor, ordenar, topN]);

    const coloresUsar = PALETAS[paleta] || PALETAS['Institucional'];
    const total = dataAgrupada.reduce((acc, cur) => acc + cur.value, 0);

    return (
        <Box mt={4}>
            {console.log("Graficos - Longitud de dataAgrupada:", dataAgrupada.length)}
            <Typography
                variant="h6"
                sx={{
                    mb: 3,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    color: '#2e7d32',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                }}
            >
                <InsertChartIcon fontSize="medium" />
                Análisis por <strong>&nbsp;{columnaAgrupacion}</strong> — Total de <strong>&nbsp;{columnaValor}</strong>
            </Typography>

            {dataAgrupada.length === 0 ? (
                <Typography variant="body1" color="text.secondary" align="center" mt={5}>
                    No hay datos suficientes para mostrar el gráfico.
                </Typography>
            ) : (
                <Box
                    sx={{
                        display: 'grid',
                        gap: 4,
                        gridTemplateColumns: {
                            xs: '1fr',
                            md: tipoGrafico === 'Ambos' ? '1fr 1fr' : '1fr',
                        },
                    }}
                >
                    {(tipoGrafico === 'Barras' || tipoGrafico === 'Ambos') && (
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={dataAgrupada}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip
                                    formatter={(value, name, props) => [
                                        `${value.toLocaleString()} (${((value / total) * 100).toFixed(1)}%)`,
                                        columnaValor,
                                    ]}
                                    contentStyle={{
                                        backgroundColor: '#ffffff',
                                        border: '1px solid #ccc',
                                        fontSize: '0.85rem',
                                    }}
                                />
                                <Bar dataKey="value" fill={coloresUsar[0]} animationDuration={1000}>
                                    <LabelList
                                        dataKey="value"
                                        position="top"
                                        formatter={(value) =>
                                            mostrarPorcentajeBarras
                                                ? `${((value / total) * 100).toFixed(1)}%`
                                                : value.toLocaleString()
                                        }
                                    />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    )}

                    {(tipoGrafico === 'Pastel' || tipoGrafico === 'Ambos') && (
                        <ResponsiveContainer width="100%" height={400}>
                            <PieChart>
                                <Pie
                                    data={dataAgrupada}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={130}
                                    label={({ name, percent }) =>
                                        `${name} (${(percent * 100).toFixed(1)}%)`
                                    }
                                    animationDuration={1000}
                                >
                                    {dataAgrupada.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={coloresUsar[index % coloresUsar.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value) =>
                                        `${value.toLocaleString()} (${((value / total) * 100).toFixed(1)}%)`
                                    }
                                    contentStyle={{
                                        backgroundColor: '#ffffff',
                                        border: '1px solid #ccc',
                                        fontSize: '0.85rem',
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </Box>
            )}
        </Box>
    );
};

export default Graficos;