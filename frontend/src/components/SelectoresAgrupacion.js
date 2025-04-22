import React from 'react';
import {
    Paper,
    Typography,
    Stack,
    Autocomplete,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import SettingsIcon from '@mui/icons-material/Settings';

const PALETAS = {
    Institucional: ['#4caf50', '#fdd835', '#ff9800', '#2196f3', '#9c27b0', '#ff5722'],
    Pastel: ['#ffd1dc', '#bae1ff', '#caffbf', '#fdffb6', '#a0c4ff', '#ffc6ff'],
    Fuego: ['#ff5722', '#ff7043', '#ff8a65', '#ffab91', '#d84315', '#bf360c'],
    Frío: ['#00bcd4', '#4dd0e1', '#80deea', '#b2ebf2', '#e0f7fa', '#006064'],
    Oceano: ['#034078', '#05668D', '#028090', '#00A896', '#02C8A9'],
};

const SelectoresAgrupacion = ({
    columnas,
    columnaAgrupar,
    setColumnaAgrupar,
    columnaValor,
    setColumnaValor,
    tipoGrafico,
    setTipoGrafico,
    paleta,
    setPaleta,
    ordenar,
    setOrdenar,
    topN,
    setTopN,
    mostrarPorcentajeBarras,
    setMostrarPorcentajeBarras,
}) => {
    return (
        <Paper
            elevation={3}
            sx={{
                p: 3,
                mb: 4,
                borderRadius: 3,
                backgroundColor: '#f9f9f9',
                borderLeft: '6px solid #388E3C',
            }}
        >
            <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ color: '#388E3C', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}
            >
                <SettingsIcon color="success" /> Configuración de Gráficos
            </Typography>

            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={3}
                justifyContent="flex-start"
                mb={2}
            >
                <Autocomplete
                    options={columnas}
                    value={columnaAgrupar}
                    onChange={(e, newValue) => setColumnaAgrupar(newValue || '')}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Agrupar por"
                            variant="outlined"
                            InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                    <>
                                        <GroupIcon sx={{ color: '#4CAF50', mr: 1 }} />
                                        {params.InputProps.startAdornment}
                                    </>
                                ),
                            }}
                            sx={{
                                bgcolor: 'white',
                                borderRadius: 2,
                            }}
                        />
                    )}
                    fullWidth
                />

                <Autocomplete
                    options={columnas}
                    value={columnaValor}
                    onChange={(e, newValue) => setColumnaValor(newValue || '')}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Columna de valor"
                            variant="outlined"
                            InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                    <>
                                        <MonetizationOnIcon sx={{ color: '#4CAF50', mr: 1 }} />
                                        {params.InputProps.startAdornment}
                                    </>
                                ),
                            }}
                            sx={{
                                bgcolor: 'white',
                                borderRadius: 2,
                            }}
                        />
                    )}
                    fullWidth
                />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                <FormControl fullWidth>
                    <InputLabel id="tipo-grafico-label">Tipo de gráfico</InputLabel>
                    <Select
                        labelId="tipo-grafico-label"
                        value={tipoGrafico}
                        label="Tipo de gráfico"
                        onChange={(e) => setTipoGrafico(e.target.value)}
                    >
                        <MenuItem value="Barras">Barras</MenuItem>
                        <MenuItem value="Pastel">Pastel</MenuItem>
                        <MenuItem value="Ambos">Ambos</MenuItem>
                    </Select>
                </FormControl>

                <FormControl fullWidth>
                    <InputLabel id="paleta-color-label">Paleta de colores</InputLabel>
                    <Select
                        labelId="paleta-color-label"
                        value={paleta}
                        label="Paleta de colores"
                        onChange={(e) => setPaleta(e.target.value)}
                    >
                        {Object.keys(PALETAS).map((key) => (
                            <MenuItem key={key} value={key}>
                                {key}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    fullWidth
                    type="number"
                    label="Top N"
                    value={topN}
                    onChange={(e) => setTopN(parseInt(e.target.value) || 0)}
                    inputProps={{ min: 1 }}
                />

                <FormControl fullWidth>
                    <InputLabel id="ordenar-label">Ordenar</InputLabel>
                    <Select
                        labelId="ordenar-label"
                        value={ordenar ? 'Sí' : 'No'}
                        label="Ordenar"
                        onChange={(e) => setOrdenar(e.target.value === 'Sí')}
                    >
                        <MenuItem value="Sí">Sí</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                    </Select>
                </FormControl>
                {tipoGrafico.includes('Barras') && (
                    <FormControl fullWidth>
                        <InputLabel id="mostrar-porcentaje-label">Mostrar %</InputLabel>
                        <Select
                            labelId="mostrar-porcentaje-label"
                            value={mostrarPorcentajeBarras ? 'Sí' : 'No'}
                            label="Mostrar %"
                            onChange={(e) => setMostrarPorcentajeBarras(e.target.value === 'Sí')}
                        >
                            <MenuItem value="Sí">Sí</MenuItem>
                            <MenuItem value="No">No</MenuItem>
                        </Select>
                    </FormControl>
                )}
            </Stack>
        </Paper>
    );
};

export default SelectoresAgrupacion;