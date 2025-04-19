import React from 'react';
import { Box, Button, Tooltip } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { CSVLink } from 'react-csv';

const ExportButtons = ({ datos, columnasVisibles, onExport }) => {
  const tieneDatos = datos?.length > 0 && columnasVisibles?.length > 0;

  const headersCSV = columnasVisibles.map((col) => ({
    label: col,
    key: col,
  }));

  return (
    <Box display="flex" gap={2} flexWrap="wrap" justifyContent="center">
      {tieneDatos && (
        <Tooltip title="Exportar como CSV">
          <CSVLink
            data={datos}
            headers={headersCSV}
            filename="datos_exportados.csv"
            style={{ textDecoration: 'none' }}
          >
            <Button
              variant="outlined"
              color="primary"
              startIcon={<FileDownloadIcon />}
            >
              Exportar CSV
            </Button>
          </CSVLink>
        </Tooltip>
      )}

      {tieneDatos && (
        <Tooltip title="Exportar como Excel">
          <Button
            variant="contained"
            color="primary"
            startIcon={<FileDownloadIcon />}
            onClick={onExport}
          >
            Exportar Excel
          </Button>
        </Tooltip>
      )}
    </Box>
  );
};

export default ExportButtons;