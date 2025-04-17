import React from 'react';
import { Button, Stack, Fab, Tooltip } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import GetAppIcon from '@mui/icons-material/GetApp';
import { CSVLink } from 'react-csv';

const ExportButtons = ({ datos, columnas, onExport }) => {
  return (
    <>
      {/* Botón de exportación tradicional (Excel, PDF, etc.) */}
      <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
        <Button
          variant="contained"
          color="success"
          startIcon={<FileDownloadIcon />}
          onClick={onExport}
        >
          Exportar Excel
        </Button>
      </Stack>

      {/* Botón flotante para exportar CSV */}
      {datos?.length > 0 && columnas?.length > 0 && (
        <Tooltip title="Exportar CSV">
          <CSVLink
            data={datos}
            filename="datos_exportados.csv"
            headers={columnas.map((col) => ({ label: col, key: col }))}
            style={{ textDecoration: 'none' }}
          >
            <Fab
              color="success"
              aria-label="export"
              sx={{
                position: 'fixed',
                bottom: 24,
                right: 24,
                zIndex: 1000,
              }}
            >
              <GetAppIcon />
            </Fab>
          </CSVLink>
        </Tooltip>
      )}
    </>
  );
};

export default ExportButtons;