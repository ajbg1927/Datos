import React from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import { FileDownload as FileDownloadIcon } from '@mui/icons-material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const ExportButtons = ({ datos, columnas = [] }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (formato) => {
    setAnchorEl(null);
    if (formato) {
      exportarDatos(datos, columnas, formato);
    }
  };

  const exportarDatos = (datos, columnas, formato) => {
    switch (formato) {
      case 'excel':
        exportToExcel(datos);
        break;
      case 'csv':
        exportToCSV(datos);
        break;
      case 'pdf':
        exportToPDF(datos, columnas);
        break;
      case 'txt':
        exportToTXT(datos, columnas);
        break;
      default:
        console.warn('Formato no soportado:', formato);
    }
  };

  const exportToExcel = (datos) => {
    const ws = XLSX.utils.json_to_sheet(datos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Datos');
    XLSX.writeFile(wb, 'datos.xlsx');
  };

  const exportToCSV = (datos) => {
    const ws = XLSX.utils.json_to_sheet(datos);
    const csv = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'datos.csv';
    link.click();
  };

  const exportToPDF = (datos, columnas) => {
    const doc = new jsPDF();

    const headers = columnas.map((col) => col.Header || col);
    const rows = datos.map((row) =>
      columnas.map((col) => row[col.accessor || col] ?? '')
    );

    doc.text('Datos Exportados', 14, 15);
    doc.autoTable({
      startY: 20,
      head: [headers],
      body: rows,
    });

    doc.save('datos.pdf');
  };

  const exportToTXT = (datos, columnas) => {
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
    link.download = 'datos.txt';
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
        Exportar Excel
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