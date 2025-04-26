import React, { useState, useCallback } from 'react';
import {
    Box,
    Typography,
    Paper,
    TextField,
    MenuItem,
    Divider,
    Button,
    InputAdornment,
    Grid,
    useTheme,
    useMediaQuery,
    Tooltip,
    FormControl,
    InputLabel,
    Select,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import GroupIcon from '@mui/icons-material/Group';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import EventIcon from '@mui/icons-material/Event';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import BarChartIcon from '@mui/icons-material/BarChart';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LabelIcon from '@mui/icons-material/Label'; // Importa el icono

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
    const [valorBusquedaGeneral, setValorBusquedaGeneral] = useState(filtros.busqueda || '');

    const handleChange = (columna, valor) => {
        console.log("Filtros.js: handleChange llamada para la columna:", columna, "con el valor:", valor);
        if (typeof setFiltros === 'function') {
            setFiltros((prev) => ({
                ...prev,
                [columna]: valor,
            }));
        } else {
            console.warn('setFiltros no es una función');
        }
    };

    const handleColumnaBusquedaGeneralChange = (event) => {
        setColumnaBusquedaGeneral(event.target.value);
        setValorBusquedaGeneral('');
        console.log("Filtros.js: Columna de búsqueda general cambiada a:", event.target.value);
    };

    const handleValorBusquedaGeneralChange = (event) => {
        setValorBusquedaGeneral(event.target.value);
        handleChange('busqueda', event.target.value);
        if (typeof setValorBusqueda === 'function') {
            setValorBusqueda(event.target.value);
        }
        console.log("Filtros.js: Valor de búsqueda general cambiado a:", event.target.value);
    };

    const handleBuscarGeneral = useCallback(() => {
        console.log("Filtros.js: handleBuscarGeneral llamada");
        let resultados = [];
        if (columnaBusquedaGeneral && valorBusquedaGeneral) {
            resultados = data.filter(item =>
                String(item[columnaBusquedaGeneral])?.toLowerCase().includes(valorBusquedaGeneral.toLowerCase())
            );
            console.log('Filtrando por columna:', columnaBusquedaGeneral, 'con valor:', valorBusquedaGeneral, resultados.length, 'resultados');
        } else if (valorBusquedaGeneral) {
            resultados = data.filter(item =>
                Object.values(item).some(value =>
                    String(value)?.toLowerCase().includes(valorBusquedaGeneral.toLowerCase())
                )
            );
            console.log('Buscando en todas las columnas con valor:', valorBusquedaGeneral, resultados.length, 'resultados');
        } else {
            console.log('Mostrando todos los datos (sin filtro general activo)');
        }
    }, [data, columnaBusquedaGeneral, valorBusquedaGeneral]);

    const handleLimpiarBusquedaGeneral = useCallback(() => {
        setColumnaBusquedaGeneral('');
        setValorBusquedaGeneral('');
        handleChange('busqueda', '');
        if (typeof setValorBusqueda === 'function') {
            setValorBusqueda('');
        }
        console.log('Limpiando filtro general');
    }, [setValorBusqueda, handleChange]);

    const columnasFiltrables = columnas.filter(
        (col) =>
            col !== columnaAgrupar &&
            col !== columnaValor &&
            !['busqueda', 'Fecha_desde', 'Fecha_hasta'].includes(col) &&
            !columnasNumericas.includes(col)
    );

    console.log("Filtros.js: Props recibidas - columnas:", columnas, "valoresUnicos:", valoresUnicos, "filtros:", filtros);
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

            {esBusquedaGeneral && (
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
                        aria-label={`Buscar ${columnaBusquedaGeneral ? `en ${columnaBusquedaGeneral}` : 'en todos los campos'}`}
                        sx={{ mb: 3 }}
                        placeholder={columnaBusquedaGeneral ? `Buscar en ${columnaBusquedaGeneral}...` : 'Buscar en todos los campos...'}
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
            )}

            {!esBusquedaGeneral && (
                <>
                    {columnasFecha.length > 0 && (
                        <Accordion defaultExpanded>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="fecha-content"
                                id="fecha-header"
                            >
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                    <EventIcon sx={{ mr: 1 }} />
                                    Filtrar por Fecha
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <TextField
                                            fullWidth
                                            type="date"
                                            label="Fecha desde"
                                            InputLabelProps={{ shrink: true }}
                                            value={filtros.Fecha_desde || ''}
                                            onChange={(e) => handleChange('Fecha_desde', e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <TextField
                                            fullWidth
                                            type="date"
                                            label="Fecha hasta"
                                            InputLabelProps={{ shrink: true }}
                                            value={filtros.Fecha_hasta || ''}
                                            onChange={(e) => handleChange('Fecha_hasta', e.target.value)}
                                        />
                                    </Grid>
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                    )}

                    {columnasNumericas.length > 0 && (
                        <Accordion defaultExpanded>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="numerico-content"
                                id="numerico-header"
                            >
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                    <FilterAltIcon sx={{ mr: 1 }} />
                                    Rango de Valores
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={2}>
                                    {columnasNumericas.map((col) => (
                                        <React.Fragment key={col}>
                                            <Grid item xs={12} sm={6} md={4}>
                                                <TextField
                                                    fullWidth
                                                    type="number"
                                                    label={`${col} mínimo`}
                                                    value={filtros[`${col}_min`] || ''}
                                                    onChange={(e) => handleChange(`${col}_min`, e.target.value)}
                                                    placeholder="Mín."
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={4}>
                                                <TextField
                                                    fullWidth
                                                    type="number"
                                                    label={`${col} máximo`}
                                                    value={filtros[`${col}_max`] || ''}
                                                    onChange={(e) => handleChange(`${col}_max`, e.target.value)}
                                                    placeholder="Máx."
                                                />
                                            </Grid>
                                        </React.Fragment>
                                    ))}
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                    )}

                    <Divider sx={{ my: 3 }} />
                    <Accordion defaultExpanded>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="categoria-content"
                            id="categoria-header"
                        >
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                Filtrar por Categorías
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container spacing={2}>
                                {columnasFiltrables.map((col) => {
                                    const opciones = valoresUnicos[col] || [];
                                    return (
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
                                                    {opciones.map((opcion, index) => (
                                                        <MenuItem key={index} value={opcion}>
                                                            {opcion}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </Tooltip>
                                        </Grid>
                                    );
                                })}
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