import React, { useState, useCallback } from 'react';
import { TextField, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';

const FiltroGeneral = ({ data, columnas, onFiltrar }) => {
    const [columnaSeleccionada, setColumnaSeleccionada] = useState('');
    const [valorBusqueda, setValorBusqueda] = useState('');

    const handleColumnaChange = (event) => {
        setColumnaSeleccionada(event.target.value);
        setValorBusqueda(''); 
    };

    const handleValorChange = (event) => {
        setValorBusqueda(event.target.value);
    };

    const handleFiltrar = useCallback(() => {
        if (columnaSeleccionada && valorBusqueda) {
            const resultados = data.filter(item =>
                String(item[columnaSeleccionada])?.toLowerCase().includes(valorBusqueda.toLowerCase())
            );
            onFiltrar(resultados);
        } else if (valorBusqueda) {
            const resultados = data.filter(item =>
                Object.values(item).some(value =>
                    String(value)?.toLowerCase().includes(valorBusqueda.toLowerCase())
                )
            );
            onFiltrar(resultados);
        } else {
            onFiltrar(data); 
        }
    }, [data, columnaSeleccionada, valorBusqueda, onFiltrar]);

    const handleLimpiarFiltro = useCallback(() => {
        setColumnaSeleccionada('');
        setValorBusqueda('');
        onFiltrar(data);
    }, [data, onFiltrar]);

    return (
        <div>
            <FormControl fullWidth margin="normal">
                <InputLabel id="filtro-columna-label">Columna a buscar (opcional)</InputLabel>
                <Select
                    labelId="filtro-columna-label"
                    id="filtro-columna"
                    value={columnaSeleccionada}
                    label="Columna a buscar (opcional)"
                    onChange={handleColumnaChange}
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
                label={`Buscar ${columnaSeleccionada ? `en ${columnaSeleccionada}` : 'en todas las columnas'}`}
                value={valorBusqueda}
                onChange={handleValorChange}
            />
            <Button variant="contained" color="primary" onClick={handleFiltrar} sx={{ mt: 2, mr: 1 }}>
                Buscar
            </Button>
            <Button variant="outlined" onClick={handleLimpiarFiltro} sx={{ mt: 2 }}>
                Limpiar Filtro
            </Button>
        </div>
    );
};

export default FiltroGeneral;