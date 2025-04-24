import React, { useCallback } from 'react';
import { FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';

const TablaArchivos = React.memo(({ archivos = [], archivoSeleccionado, onArchivoChange }) => {
    const handleChange = useCallback(
        (e) => {
            const selectedArchivoNombreBackend = e.target.value;
            if (archivoSeleccionado?.nombreBackend !== selectedArchivoNombreBackend) {
                const selectedArchivo = archivos.find(
                    (archivo) => archivo.nombreBackend === selectedArchivoNombreBackend
                );
                onArchivoChange(selectedArchivo);
            }
        },
        [archivos, archivoSeleccionado, onArchivoChange]
    );

    return (
        <Box sx={{ mb: 3 }}>
            <FormControl fullWidth variant="outlined" sx={{ backgroundColor: '#f5f5f5' }}>
                <InputLabel sx={{ color: '#000' }}>Selecciona un archivo</InputLabel>
                <Select
                    value={archivoSeleccionado?.nombreBackend || ''}
                    label="Selecciona un archivo"
                    onChange={handleChange}
                    displayEmpty
                    renderValue={(selected) => selected?.nombreOriginal || 'Selecciona un archivo'}
                    sx={{
                        backgroundColor: '#f5f5f5',
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#cfd8dc' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#43a047' },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#43a047' },
                    }}
                >
                    <MenuItem disabled value="">
                        Selecciona un archivo
                    </MenuItem>
                    {archivos.length === 0 ? (
                        <MenuItem disabled>No hay archivos disponibles</MenuItem>
                    ) : (
                        archivos.map((archivo, index) => (
                            <MenuItem
                                key={index}
                                value={archivo.nombreBackend}
                                sx={{
                                    color: '#37474f',
                                    '&:hover': {
                                        backgroundColor: '#dcedc8',
                                    },
                                }}
                            >
                                {archivo.nombreOriginal}
                            </MenuItem>
                        ))
                    )}
                </Select>
            </FormControl>
        </Box>
    );
});

export default TablaArchivos;