import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Typography, TableSortLabel, Box, TablePagination,
    FormControlLabel, Checkbox, Popover, Button, FormGroup, IconButton
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';

const TablaDatos = ({ datosIniciales = [], columnasDefinidas = [] }) => {
    const [ordenDireccion, setOrdenDireccion] = useState('asc');
    const [ordenColumna, setOrdenColumna] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [filtros, setFiltros] = useState({});
    const [columnasVisibles, setColumnasVisibles] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);

    const columnasDetectadasInicial = columnasDefinidas.length ? columnasDefinidas : Object.keys(datosIniciales[0] || {});

    useEffect(() => {
        setColumnasVisibles(columnasDetectadasInicial);
    }, [columnasDetectadasInicial]);

    const handlePopoverOpen = (event) => setAnchorEl(event.currentTarget);
    const handlePopoverClose = () => setAnchorEl(null);
    const open = Boolean(anchorEl);

    const handleVisibilidadColumnaChange = useCallback((event) => {
        const { name, checked } = event.target;
        setColumnasVisibles(prev =>
            checked ? [...prev, name] : prev.filter(col => col !== name)
        );
    }, []);

    const handleFiltroChange = useCallback((event) => {
        const { name, value } = event.target;
        setFiltros(prev => ({
            ...prev,
            [name]: value.toLowerCase(),
        }));
        setPage(0);
    }, []);

    const ordenarDatos = useCallback((data, propiedad, direccion) => {
        return [...data].sort((a, b) => {
            const aValue = a[propiedad];
            const bValue = b[propiedad];
            if (aValue < bValue) return direccion === 'asc' ? -1 : 1;
            if (aValue > bValue) return direccion === 'asc' ? 1 : -1;
            return 0;
        });
    }, []);

    const handleSolicitarOrden = useCallback((propiedad) => () => {
        const esAsc = ordenColumna === propiedad && ordenDireccion === 'asc';
        setOrdenDireccion(esAsc ? 'desc' : 'asc');
        setOrdenColumna(propiedad);
    }, [ordenColumna, ordenDireccion]);

    const datosFiltrados = useMemo(() => {
        return datosIniciales.filter(fila =>
            Object.keys(filtros).every(columna => {
                if (!filtros[columna]) return true;
                const valorFila = String(fila[columna]).toLowerCase();
                return valorFila.includes(filtros[columna]);
            })
        );
    }, [datosIniciales, filtros]);

    const datosOrdenados = useMemo(() => {
        return ordenColumna ? ordenarDatos(datosFiltrados, ordenColumna, ordenDireccion) : datosFiltrados;
    }, [datosFiltrados, ordenColumna, ordenDireccion, ordenarDatos]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        const value = parseInt(event.target.value, 10);
        setRowsPerPage(value);
        setPage(0);
    };

    const emptyRows = rowsPerPage > 0 ? Math.max(0, (1 + page) * rowsPerPage - datosOrdenados.length) : 0;
    const columnasVisiblesActuales = columnasDetectadasInicial.filter(col => columnasVisibles.includes(col));

    if (!datosIniciales.length) {
        return (
            <Typography color="warning.main" variant="body1" textAlign="center" mt={2}>
                No hay datos para mostrar.
            </Typography>
        );
    }

    if (!columnasDetectadasInicial.length) {
        return (
            <Typography color="warning.main" variant="body1" textAlign="center" mt={2}>
                No se encontraron columnas para mostrar.
            </Typography>
        );
    }

    const TablePaginationActions = ({ count, page, rowsPerPage, onPageChange }) => {
        const handleBackButtonClick = (event) => {
            onPageChange(event, page - 1);
        };

        const handleNextButtonClick = (event) => {
            onPageChange(event, page + 1);
        };

        const isLastPage = page >= Math.ceil(count / rowsPerPage) - 1;

        return (
            <Box sx={{ flexShrink: 0, ml: 2.5 }}>
                <IconButton
                    onClick={handleBackButtonClick}
                    disabled={page === 0}
                    aria-label="Página anterior"
                >
                    <KeyboardArrowLeft />
                </IconButton>
                <IconButton
                    onClick={handleNextButtonClick}
                    disabled={isLastPage}
                    aria-label="Próxima página"
                >
                    <KeyboardArrowRight />
                </IconButton>
            </Box>
        );
    };

    return (
        <TableContainer component={Paper} sx={{ width: '100%', overflowX: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="h6">Datos</Typography>
                <Button aria-describedby={open ? 'popover' : undefined} onClick={handlePopoverOpen}>
                    Mostrar/Ocultar Columnas
                </Button>
                <Popover
                    id="popover"
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handlePopoverClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                >
                    <Box sx={{ p: 2 }}>
                        <FormGroup>
                            {columnasDetectadasInicial.map(columna => (
                                <FormControlLabel
                                    key={columna}
                                    control={
                                        <Checkbox
                                            checked={columnasVisibles.includes(columna)}
                                            onChange={handleVisibilidadColumnaChange}
                                            name={columna}
                                        />
                                    }
                                    label={columna}
                                />
                            ))}
                        </FormGroup>
                    </Box>
                </Popover>
            </Box>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        {columnasVisiblesActuales.map((columna, idx) => (
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
                                    {ordenColumna === columna && (
                                        <Box component="span" sx={visuallyHidden}>
                                            {ordenDireccion === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                        </Box>
                                    )}
                                </TableSortLabel>
                            </TableCell>
                        ))}
                    </TableRow>
                    <TableRow>
                        {columnasVisiblesActuales.map(columna => (
                            <TableCell key={`filtro-${columna}`}>
                                <input
                                    type="text"
                                    style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                                    placeholder={`Filtrar ${columna}`}
                                    name={columna}
                                    value={filtros[columna] || ''}
                                    onChange={handleFiltroChange}
                                />
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
                            {columnasVisiblesActuales.map((columna, colIndex) => (
                                <TableCell key={`${filaIndex}-${colIndex}`}>
                                    {fila[columna] != null ? String(fila[columna]) : ''}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                    {emptyRows > 0 && (
                        <TableRow style={{ height: 33 * emptyRows }}>
                            <TableCell colSpan={columnasVisiblesActuales.length} />
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50, { label: 'Todos', value: -1 }]}
                component="div"
                count={datosOrdenados.length} // Asegúrate de que el conteo sea la longitud de datosOrdenados
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
                SelectProps={{
                    inputProps: { 'aria-label': 'filas por página' },
                    native: true,
                }}
            />
        </TableContainer>
    );
};

export default React.memo(TablaDatos);