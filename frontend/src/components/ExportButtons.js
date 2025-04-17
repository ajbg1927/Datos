import React from 'react';
import { Button, Box, Tooltip, Fab } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import GetAppIcon from '@mui/icons-material/GetApp';
import { CSVLink } from 'react-csv';

const ExportButtons = ({ datos, columnas, onExport }) => {
  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          backgroundColor: 'primary.main',
          color: 'white',
          padding: 2,
          borderRadius: '16px',
          boxShadow: 4,
          zIndex: 999,
          display: 'flex',
          gap: 1,
        }}
      >
        <Button
          variant="contained"
          color="secondary"
          startIcon={<FileDownloadIcon />}
          onClick={onExport}
          sx={{
            borderRadius: 3,
            fontWeight: 'bold',
            textTransform: 'none',
            color: 'black',
          }}
        >
          Exportar Excel
        </Button>

        {datos?.length > 0 && columnas?.length > 0 && (
          <Tooltip title="Exportar CSV">
            <CSVLink
              data={datos}
              filename="datos_exportados.csv"
              headers={columnas.map((col) => ({ label: col, key: col }))}
              style={{ textDecoration: 'none' }}
            >
              <Fab
                color="secondary"
                aria-label="export-csv"
                size="medium"
              >
                <GetAppIcon sx={{ color: '#000' }} />
              </Fab>
            </CSVLink>
          </Tooltip>
        )}
      </Box>
    </>
  );
};

export default ExportButtons;