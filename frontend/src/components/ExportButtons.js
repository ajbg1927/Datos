import React from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import { FileDownload as FileDownloadIcon } from '@mui/icons-material';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const ExportButtons = ({ datos = [], columnas = [], filename = 'datos' }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

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
      console.warn('No hay datos para exportar.', { datos, columnas, formato });
      return;
    }

    if ((formato === 'pdf' || formato === 'txt') && (!columnas || columnas.length === 0)) {
      console.warn('No hay columnas definidas para exportar en este formato.', { columnas });
      return;
    }

    switch (formato) {
      case 'excel':
        exportToExcel();
        break;
      case 'csv':
        exportToCSV();
        break;
      case 'pdf':
        exportToPDF();
        break;
      case 'txt':
        exportToTXT();
        break;
      default:
        console.warn('Formato no soportado:', formato);
    }
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(datos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Datos');
    XLSX.writeFile(wb, `${filename}.xlsx`);
  };

  const exportToCSV = () => {
    const ws = XLSX.utils.json_to_sheet(datos);
    const csv = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.csv`;
    link.click();
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      startY: 20,
      head: [columnas.map((col) => col.Header || col)],
      body: datos.map((row) => columnas.map((col) => row[col.accessor || col] ?? '')),
    });
    doc.save(`${filename}.pdf`);
  };

  const exportToTXT = () => {
    const headers = columnas.map((col) => col.Header || col).join('\t');
    const rows = datos
      .map((row) =>
        columnas.map((col) => row[col.accessor || col] ?? '').join('\t')
      )
      .join('\n');
    const txtContent = `${headers}\n${rows}`;
    const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.txt`;
    link.click();
  };

  return (
    <>
      <Button
        variant="contained"
        color="success"
        startIcon={<FileDownloadIcon />}
        onClick={handleClick}
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