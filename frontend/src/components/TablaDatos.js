import React, { useState, useEffect, useCallback } from 'react';
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
    FormControlLabel,
    Checkbox,
    Popover,
    Button,
    FormGroup,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';

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

    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    const handleVisibilidadColumnaChange = useCallback((event) => {
        const { name, checked } = event.target;
        setColumnasVisibles(prev =>
            checked ? [...prev, name] : prev.filter(col => col !== name)
        );
    }, []);

    const handleFiltroChange = useCallback((event) => {
        const { name, value } = event.target;
        setFiltros(prevFiltros => ({
            ...prevFiltros,
            [name]: value.toLowerCase(),
        }));
        setPage(0); 
    }, []);

    const datosFiltrados = React.useMemo(() => {
        return datosIniciales.filter(fila => {
            return Object.keys(filtros).every(columna => {
                if (!filtros[columna]) return true;
                const valorFila = String(fila[columna]).toLowerCase();
                return valorFila.includes(filtros[columna]);
            });
        });
    }, [datosIniciales, filtros]);

    const ordenarDatos = useCallback((data, propiedad, direccion) => {
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
    }, []);

    const datosOrdenados = React.useMemo(() => {
        return ordenColumna ? ordenarDatos(datosFiltrados, ordenColumna, ordenDireccion) : datosFiltrados;
    }, [datosFiltrados, ordenColumna, ordenDireccion, ordenarDatos]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const emptyRows =
        rowsPerPage - Math.min(rowsPerPage, datosOrdenados.length - page * rowsPerPage);

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
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                >
                    <Box sx={{ p: 2 }}>
                        <FormGroup>
                            {columnasDetectadasInicial.map((columna) => (
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
                                    {ordenColumna === columna ? (
                                        <Box component="span" sx={visuallyHidden}>
                                            {ordenDireccion === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                        </Box>
                                    ) : null}
                                </TableSortLabel>
                            </TableCell>
                        ))}
                    </TableRow>
                    <TableRow>
                        {columnasVisiblesActuales.map((columna) => (
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
                colSpan={columnasVisiblesActuales.length}
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