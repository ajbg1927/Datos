import React from 'react';
import { Box, Button, Paper, Typography } from '@mui/material';

const ExportButtons = ({ exportToExcel, exportToCSV, exportToPDF, exportToTXT }) => {
  return (
    <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Exportar datos
      </Typography>
      <Box display="flex" flexWrap="wrap" gap={2}>
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
    </Paper>
  );
};

export default ExportButtons;
