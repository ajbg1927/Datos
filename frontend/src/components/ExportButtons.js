import React from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import { FileDownload as FileDownloadIcon } from '@mui/icons-material';
import useExportaciones from '../hooks/useExportaciones';

const ExportButtons = ({ datos = [], columnas = [], filename = 'datos' }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { exportToExcel, exportToCSV, exportToPDF, exportToTXT } = useExportaciones();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (formato) => {
    setAnchorEl(null);
    if (formato) {
      exportarDatos(formato);
    }
  };

  const exportarDatos = (formato) => {
    if (!datos || datos.length === 0) {
      console.warn('No hay datos para exportar.');
      return;
    }

    if ((formato === 'pdf' || formato === 'txt') && (!columnas || columnas.length === 0)) {
      console.warn('No hay columnas definidas para exportar en este formato.');
      return;
    }

    const columnasHeaders = columnas.map(col => (typeof col === 'object' ? col.accessor || col.Header : col));

    switch (formato) {
      case 'excel':
        exportToExcel(datos, columnasHeaders, `${filename}.xlsx`);
        break;
      case 'csv':
        exportToCSV(datos, columnasHeaders, `${filename}.csv`);
        break;
      case 'pdf':
        exportToPDF(datos, columnasHeaders, `${filename}.pdf`);
        break;
      case 'txt':
        exportToTXT(datos, columnasHeaders, `${filename}.txt`);
        break;
      default:
        console.warn('Formato no soportado:', formato);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="success"
        startIcon={<FileDownloadIcon />}
        onClick={handleClick}
        sx={{
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 'bold',
          paddingX: 2,
          paddingY: 1,
          transition: 'all 0.3s ease',
          boxShadow: 2,
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 6,
          },
        }}
      >
        Exportar Datos
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleClose(null)}
      >
        {columnas && columnas.length > 0 ? (
          <>
            <MenuItem onClick={() => handleClose('excel')}>Exportar a Excel</MenuItem>
            <MenuItem onClick={() => handleClose('csv')}>Exportar a CSV</MenuItem>
            <MenuItem onClick={() => handleClose('pdf')}>Exportar a PDF</MenuItem>
            <MenuItem onClick={() => handleClose('txt')}>Exportar a TXT</MenuItem>
          </>
        ) : (
          <MenuItem disabled>No hay columnas para exportar</MenuItem>
        )}
      </Menu>
    </>
  );
};

export default ExportButtons;