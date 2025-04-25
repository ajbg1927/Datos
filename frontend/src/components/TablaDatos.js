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

const TablaDatos = ({ datos = [], columnas = [] }) => {
    if (!datos.length) {
        return (
            <Typography color="warning.main" variant="body1" textAlign="center" mt={2}>
                No hay datos para mostrar.
            </Typography>
        );
    }

    if (!columnas.length) {
        return (
            <Typography color="warning.main" variant="body1" textAlign="center" mt={2}>
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
                            <TableCell key={columna || idx} sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                                {columna}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {datos.map((fila, filaIndex) => (
                        <TableRow key={filaIndex}>
                            {columnas.map((columna, colIndex) => (
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