import React from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import { FileDownload as FileDownloadIcon } from '@mui/icons-material';

const ExportButtons = ({ datos, columnas = [], onExport }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (formato) => {
    setAnchorEl(null);
    if (formato) {
      onExport(formato);
    }
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