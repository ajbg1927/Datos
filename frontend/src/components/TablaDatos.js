import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography
} from '@mui/material';

const TablaDatos = ({ datos, columnas }) => {
    console.log("Renderizando TablaDatos");
    console.log("Columnas recibidas:", columnas);
    console.log("Datos recibidos:", datos);

    if (!datos || datos.length === 0) {
        return (
            <Typography color="warning.main" variant="body1">
                No hay datos para mostrar.
            </Typography>
        );
    }

    if (!columnas || columnas.length === 0) {
        return (
            <Typography color="warning.main" variant="body1">
                No se encontraron columnas para mostrar.
            </Typography>
        );
    }

    return (
        <TableContainer component={Paper}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        {columnas.map((columna, idx) => (
                            <TableCell key={idx} sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                                {columna}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {datos.map((fila, filaIndex) => (
                        <TableRow key={filaIndex}>
                            {columnas.map((columna, colIndex) => (
                                <TableCell key={colIndex}>
                                    {fila[columna] !== undefined ? String(fila[columna]) : ''}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default TablaDatos;