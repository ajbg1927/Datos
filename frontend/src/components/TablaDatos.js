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
    TablePagination,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';

const TablaDatos = ({ datos = [], columnas = [] }) => {
    const [ordenDireccion, setOrdenDireccion] = useState('asc');
    const [ordenColumna, setOrdenColumna] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5); // Puedes ajustar el valor inicial

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

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Volver a la primera página al cambiar la cantidad de filas
    };

    const datosOrdenados = ordenColumna ? ordenarDatos(datos, ordenColumna, ordenDireccion) : datos;

    const emptyRows =
        rowsPerPage - Math.min(rowsPerPage, datosOrdenados.length - page * rowsPerPage);

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
                    {(rowsPerPage > 0
                        ? datosOrdenados.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        : datosOrdenados
                    ).map((fila, filaIndex) => (
                        <TableRow key={filaIndex}>
                            {columnasDetectadas.map((columna, colIndex) => (
                                <TableCell key={`${filaIndex}-${colIndex}`}>
                                    {fila[columna] != null ? String(fila[columna]) : ''}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}

                    {emptyRows > 0 && (
                        <TableRow style={{ height: 33 * emptyRows }}>
                            <TableCell colSpan={columnasDetectadas.length} />
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50, 100, { label: 'Todos', value: -1 }]}
                colSpan={columnasDetectadas.length}
                count={datosOrdenados.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                    inputProps: {
                        'aria-label': 'filas por página',
                    },
                    native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={({ count, page, rowsPerPage, onPageChange }) => (
                    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
                        <button
                            onClick={(event) => onPageChange(event, page - 1)}
                            disabled={page === 0}
                            aria-label="página anterior"
                        >
                            {'<'}
                        </button>
                        <button
                            onClick={(event) => onPageChange(event, page + 1)}
                            disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                            aria-label="próxima página"
                        >
                            {'>'}
                        </button>
                    </Box>
                )}
            />
        </TableContainer>
    );
};

export default React.memo(TablaDatos);