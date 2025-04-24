import React, { useCallback } from 'react';
import {
    FormControl,
    FormLabel,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Paper,
    Typography,
    Divider,
    Box,
} from '@mui/material';

const areEqual = (prevProps, nextProps) => {
    return (
        prevProps.hojas === nextProps.hojas &&
        prevProps.hojasSeleccionadas === nextProps.hojasSeleccionadas &&
        prevProps.setHojasSeleccionadas === nextProps.setHojasSeleccionadas
    );
};

const SelectorHojas = React.memo(({ hojas, hojasSeleccionadas, setHojasSeleccionadas }) => {
    const todasSeleccionadas = hojasSeleccionadas.length === hojas.length;
    const algunasSeleccionadas = hojasSeleccionadas.length > 0 && !todasSeleccionadas;

    const handleToggle = useCallback(
        (hoja) => {
            setHojasSeleccionadas((prev) =>
                prev.includes(hoja)
                    ? prev.filter((h) => h !== hoja)
                    : [...prev, hoja]
            );
        },
        [setHojasSeleccionadas]
    );

    const handleToggleAll = useCallback(
        () => {
            setHojasSeleccionadas(todasSeleccionadas ? [] : hojas);
        },
        [hojas, todasSeleccionadas, setHojasSeleccionadas]
    );

    if (!hojas || hojas.length === 0) return null;

    return (
        <Paper
            elevation={4}
            sx={{
                p: 3,
                mb: 3,
                borderLeft: '6px solid #2e7d32',
                backgroundColor: '#fcfcfc',
            }}
        >
            <Box display="flex" flexDirection="column" gap={2}>
                <Typography variant="h6" sx={{ color: '#2e7d32' }}>
                    Selección de hojas
                </Typography>
                <Divider />
                <FormControl component="fieldset" variant="standard">
                    <FormLabel component="legend">
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            Marca las hojas que deseas combinar:
                        </Typography>
                    </FormLabel>
                    <FormGroup
                        row
                        sx={{
                            flexWrap: 'wrap',
                            maxHeight: 250,
                            overflowY: 'auto',
                        }}
                    >
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={todasSeleccionadas}
                                    indeterminate={algunasSeleccionadas}
                                    onChange={handleToggleAll}
                                    sx={{
                                        color: '#2e7d32',
                                        '&.Mui-checked': { color: '#ffcd00' },
                                        '&.MuiCheckbox-indeterminate': {
                                            color: '#ffcd00',
                                        },
                                    }}
                                />
                            }
                            label={
                                <Typography variant="body2" fontWeight="bold">
                                    Seleccionar todas
                                </Typography>
                            }
                        />
                        {hojas.map((hoja) => (
                            <FormControlLabel
                                key={hoja}
                                control={
                                    <Checkbox
                                        checked={hojasSeleccionadas.includes(hoja)}
                                        onChange={() => handleToggle(hoja)}
                                        name={hoja}
                                        sx={{
                                            color: '#2e7d32',
                                            '&.Mui-checked': {
                                                color: '#ffcd00',
                                            },
                                        }}
                                    />
                                }
                                label={<Typography variant="body2">{hoja}</Typography>}
                            />
                        ))}
                    </FormGroup>
                </FormControl>
            </Box>
        </Paper>
    );
}, areEqual); 

export default SelectorHojas;