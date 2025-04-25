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
    TablePagination,
    Box,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'; 

const TablaDatos = ({ datos, columnas }) => {
    console.log("DATOS EN TABLA:", datos);
    console.log("COLUMNAS EN TABLA:", columnas);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const rowsToShow = datos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const columnasFinales = columnas && columnas.length > 0 
        ? columnas 
        : datos.length > 0 
            ? Object.keys(datos[0]) 
            : [];

    const datosVacios = !datos || datos.length === 0 || (datos.length > 0 && Object.keys(datos[0]).length === 0);

    if (datosVacios) {
        return (
            <Box sx={{ textAlign: 'center', mt: 8 }}>
                <InfoOutlinedIcon sx={{ fontSize: 80, color: 'grey.400' }} />
                <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
                    No hay datos estructurados para mostrar
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Selecciona un archivo y hoja para visualizar la información.
                </Typography>
            </Box>
        );
    }

    return (
        <TableContainer component={Paper} sx={{ maxWidth: '100%', overflowX: 'auto' }}>
            <Table size="small" stickyHeader>
                <TableHead>
                    <TableRow>
                        {columnasFinales.map((columna) => (
                            <TableCell key={columna} sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>
                                {columna}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rowsToShow.map((fila, index) => (
                        <TableRow key={index}>
                            {columnasFinales.map((columna) => (
                                <TableCell key={columna}>
                                    {typeof fila[columna] === 'number'
                                        ? fila[columna].toLocaleString('es-CO')
                                        : fila[columna]}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <TablePagination
                component="div"
                count={datos.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[10, 25, 50, 100]}
            />
        </TableContainer>
    );
};

export default TablaDatos;