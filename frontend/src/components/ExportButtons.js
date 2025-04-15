import React from 'react';
import { Button, Stack } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

const ExportButtons = ({ onExport }) => {
  return (
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
  );
};

export default ExportButtons;

