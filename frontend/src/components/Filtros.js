import React, { useState, useCallback } from 'react';
import {
    Box, Typography, Paper, TextField, MenuItem, Divider, Button,
    InputAdornment, Grid, useTheme, useMediaQuery, Tooltip, FormControl,
    InputLabel, Select, Accordion, AccordionSummary, AccordionDetails,
} from '@mui/material';
import {
    Search as SearchIcon,
    Group as GroupIcon,
    AttachMoney as AttachMoneyIcon,
    ClearAll as ClearAllIcon,
    Event as EventIcon,
    FilterAlt as FilterAltIcon,
    BarChart as BarChartIcon,
    ExpandMore as ExpandMoreIcon,
    Label as LabelIcon,
} from '@mui/icons-material';

const Filtros = ({
    data = [],
    columnas = [],
    valoresUnicos = {},
    filtros = {},
    setFiltros = () => {},
    handleClearFilters = () => {},
    columnasFecha = [],
    columnasNumericas = [],
    valorBusqueda = '',
    setValorBusqueda = () => {},
    columnaAgrupar = '',
    setColumnaAgrupar = () => {},
    columnaValor = '',
    setColumnaValor = () => {},
    esBusquedaGeneral = false,
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [columnaBusquedaGeneral, setColumnaBusquedaGeneral] = useState('');
    const [valorBusquedaGeneral, setValorBusquedaGeneral] = useState('');

    const handleChange = (columna, valor) => {
        setFiltros((prev) => ({
            ...prev,
            [columna]: valor,
        }));
    };

    const handleColumnaBusquedaGeneralChange = (event) => {
        const newCol = event.target.value;
        setColumnaBusquedaGeneral(newCol);
        setValorBusquedaGeneral('');
        setValorBusqueda('');  
        handleChange('busqueda', '');
    };

    const handleValorBusquedaGeneralChange = (event) => {
        const newValor = event.target.value;
        setValorBusquedaGeneral(newValor);
        setValorBusqueda(newValor);
        handleChange('busqueda', newValor);
    };

    const handleBuscarGeneral = useCallback(() => {
        console.log("Filtros.js: handleBuscarGeneral llamada");
    }, []);

    const handleLimpiarBusquedaGeneral = useCallback(() => {
        setColumnaBusquedaGeneral('');
        setValorBusquedaGeneral('');
        setValorBusqueda('');
        handleClearFilters(); 
    }, [handleClearFilters, setValorBusqueda]);

    const columnasFiltrables = columnas.filter(
        (col) =>
            col !== columnaAgrupar &&
            col !== columnaValor &&
            !['busqueda', 'Fecha_desde', 'Fecha_hasta'].includes(col) &&
            !columnasNumericas.includes(col)
    );

    return (
        <Paper
            elevation={1}
            sx={{
                p: 3,
                borderRadius: 3,
                bgcolor: '#fdfdfd',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}
        >
            {!esBusquedaGeneral && (
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.success.main, mb: 2 }}>
                    Panel de Filtros
                </Typography>
            )}

            {esBusquedaGeneral ? (
                <>
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="filtro-columna-label">Buscar en columna (opcional)</InputLabel>
                        <Select
                            labelId="filtro-columna-label"
                            id="filtro-columna"
                            value={columnaBusquedaGeneral}
                            label="Buscar en columna (opcional)"
                            onChange={handleColumnaBusquedaGeneralChange}
                        >
                            <MenuItem value="">Todas las columnas</MenuItem>
                            {columnas.map((col) => (
                                <MenuItem key={col} value={col}>{col}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        fullWidth
                        margin="normal"
                        label={`Buscar ${columnaBusquedaGeneral ? `en ${columnaBusquedaGeneral}` : 'en todos los campos'}`}
                        value={valorBusquedaGeneral}
                        onChange={handleValorBusquedaGeneralChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        placeholder={columnaBusquedaGeneral ? `Buscar en ${columnaBusquedaGeneral}...` : 'Buscar en todos los campos...'}
                        sx={{ mb: 3 }}
                    />
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <Button variant="contained" color="primary" onClick={handleBuscarGeneral}>
                            Buscar
                        </Button>
                        <Button variant="outlined" onClick={handleLimpiarBusquedaGeneral}>
                            Limpiar Búsqueda
                        </Button>
                    </Box>
                </>
            ) : (
                <>
                    {columnasFecha.length > 0 && (
                        <Accordion defaultExpanded>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                    <EventIcon sx={{ mr: 1 }} />
                                    Filtrar por Fecha
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={2}>
                                    {['Fecha_desde', 'Fecha_hasta'].map((tipoFecha) => (
                                        <Grid item xs={12} sm={6} md={4} key={tipoFecha}>
                                            <TextField
                                                fullWidth
                                                type="date"
                                                label={tipoFecha === 'Fecha_desde' ? 'Fecha desde' : 'Fecha hasta'}
                                                InputLabelProps={{ shrink: true }}
                                                value={filtros[tipoFecha] || ''}
                                                onChange={(e) => handleChange(tipoFecha, e.target.value)}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                    )}

                    {columnasNumericas.length > 0 && (
                        <Accordion defaultExpanded>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                    <FilterAltIcon sx={{ mr: 1 }} />
                                    Rango de Valores
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={2}>
                                    {columnasNumericas.map((col) => (
                                        <React.Fragment key={col}>
                                            {['min', 'max'].map((tipo) => (
                                                <Grid item xs={12} sm={6} md={4} key={`${col}_${tipo}`}>
                                                    <TextField
                                                        fullWidth
                                                        type="number"
                                                        label={`${col} ${tipo === 'min' ? 'mínimo' : 'máximo'}`}
                                                        value={filtros[`${col}_${tipo}`] || ''}
                                                        onChange={(e) => handleChange(`${col}_${tipo}`, e.target.value)}
                                                        placeholder={tipo === 'min' ? 'Mín.' : 'Máx.'}
                                                        InputProps={{ inputProps: { min: 0 } }}
                                                    />
                                                </Grid>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                    )}

                    <Divider sx={{ my: 3 }} />
                    <Accordion defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                Filtrar por Categorías
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container spacing={2}>
                                {columnasFiltrables.map((col) => (
                                    <Grid item xs={12} sm={6} md={4} key={col}>
                                        <Tooltip title={`Filtrar por ${col}`} arrow>
                                            <TextField
                                                select
                                                fullWidth
                                                label={`Filtrar por ${col}`}
                                                value={filtros[col] || ''}
                                                onChange={(e) => handleChange(col, e.target.value)}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <LabelIcon />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            >
                                                <MenuItem value="">Todos</MenuItem>
                                                {(valoresUnicos[col] || []).map((opcion, index) => (
                                                    <MenuItem key={index} value={opcion}>
                                                        {opcion}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </Tooltip>
                                    </Grid>
                                ))}
                            </Grid>
                        </AccordionDetails>
                    </Accordion>

                    <Box mt={4} textAlign="center">
                        <Button
                            variant="contained"
                            color="error"
                            fullWidth={isMobile}
                            startIcon={<ClearAllIcon />}
                            onClick={handleClearFilters}
                        >
                            Limpiar Filtros
                        </Button>
                    </Box>
                </>
            )}
        </Paper>
    );
};

export default Filtros;