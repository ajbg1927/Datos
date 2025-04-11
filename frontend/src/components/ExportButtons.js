import React from 'react';
import { Box, Button } from '@mui/material';

const ExportButtons = ({ exportToExcel, exportToCSV, exportToPDF, exportToTXT }) => {
  return (
    <Box display="flex" gap={2} flexWrap="wrap" m={2}>
      <Button variant="contained" color="success" onClick={exportToExcel}>
        Exportar a Excel
      </Button>
      <Button variant="contained" color="info" onClick={exportToCSV}>
        Exportar a CSV
      </Button>
      <Button variant="contained" color="secondary" onClick={exportToPDF}>
        Exportar a PDF
      </Button>
      <Button variant="contained" color="warning" onClick={exportToTXT}>
        Exportar a TXT
      </Button>
    </Box>
  );
};

export default ExportButtons;