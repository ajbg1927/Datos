import React from 'react';
import { Button, Box, Tooltip, Fab } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import GetAppIcon from '@mui/icons-material/GetApp';
import { CSVLink } from 'react-csv';

const ExportButtons = ({ datos, columnasVisibles, onExport }) => {
  const tieneDatos = datos?.length > 0;
  const columnasValidas = columnasVisibles?.length > 0;

  const headersCSV = columnasVisibles?.map((col) => ({
    label: col,
    key: col,
  }));

  return (
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
        gap: 2,
        alignItems: 'center',
      }}
    >
      <Button
        variant="contained"
        color="secondary"
        startIcon={<FileDownloadIcon />}
        onClick={onExport}
        disabled={!tieneDatos}
        sx={{
          borderRadius: 3,
          fontWeight: 'bold',
          textTransform: 'none',
          color: 'black',
        }}
      >
        Exportar Excel
      </Button>

      {tieneDatos && columnasValidas && (
        <Tooltip title="Exportar como CSV (filtrado)">
          <span> {/* evita error con tooltip y botón deshabilitado */}
            <CSVLink
              data={datos}
              filename="datos_filtrados.csv"
              headers={headersCSV}
              style={{ textDecoration: 'none' }}
            >
              <Fab color="secondary" size="medium" component="span">
                <GetAppIcon sx={{ color: '#000' }} />
              </Fab>
            </CSVLink>
          </span>
        </Tooltip>
      )}
    </Box>
  );
};

export default ExportButtons;