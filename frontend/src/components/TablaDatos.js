import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    TableSortLabel,
    Box,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';

const TablaDatos = ({ datos = [], columnas = [] }) => {
    const [ordenDireccion, setOrdenDireccion] = useState('asc');
    const [ordenColumna, setOrdenColumna] = useState(null);

    if (!datos.length) {
        return (
            <Typography color="warning.main" variant="body1" textAlign="center" mt={2}>
                No hay datos para mostrar.
            </Typography>
        );
    }

    const columnasDetectadas = columnas.length ? columnas : Object.keys(datos[0] || {});

    if (!columnasDetectadas.length) {
        return (
            <Typography color="warning.main" variant="body1" textAlign="center" mt={2}>
                No se encontraron columnas para mostrar.
            </Typography>
        );
    }

    const ordenarDatos = (data, propiedad, direccion) => {
        return [...data].sort((a, b) => {
            const aValue = a[propiedad];
            const bValue = b[propiedad];
            if (aValue < bValue) {
                return direccion === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return direccion === 'asc' ? 1 : -1;
            }
            return 0;
        });
    };

    const handleSolicitarOrden = (propiedad) => () => {
        const esAsc = ordenColumna === propiedad && ordenDireccion === 'asc';
        setOrdenDireccion(esAsc ? 'desc' : 'asc');
        setOrdenColumna(propiedad);
    };

    const datosOrdenados = ordenColumna ? ordenarDatos(datos, ordenColumna, ordenDireccion) : datos;

    return (
        <TableContainer component={Paper} sx={{ width: '100%', overflowX: 'auto' }}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        {columnasDetectadas.map((columna, idx) => (
                            <TableCell
                                key={columna || idx}
                                sortDirection={ordenColumna === columna ? ordenDireccion : false}
                                sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}
                            >
                                <TableSortLabel
                                    active={ordenColumna === columna}
                                    direction={ordenColumna === columna ? ordenDireccion : 'asc'}
                                    onClick={handleSolicitarOrden(columna)}
                                >
                                    {columna}
                                    {ordenColumna === columna ? (
                                        <Box component="span" sx={visuallyHidden}>
                                            {ordenDireccion === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                        </Box>
                                    ) : null}
                                </TableSortLabel>
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {datosOrdenados.map((fila, filaIndex) => (
                        <TableRow key={filaIndex}>
                            {columnasDetectadas.map((columna, colIndex) => (
                                <TableCell key={`${filaIndex}-${colIndex}`}>
                                    {fila[columna] != null ? String(fila[columna]) : ''}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default React.memo(TablaDatos);