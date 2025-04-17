import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const UploadFile = ({ onFilesUploaded }) => {
  const handleChange = (e) => {
    const files = Array.from(e.target.files);
    if (typeof onFilesUploaded === 'function') {
      onFilesUploaded(files);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (typeof onFilesUploaded === 'function') {
      onFilesUploaded(files);
    }
  };

  return (
    <Box
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      sx={{
        border: '2px dashed #ccc',
        padding: 3,
        borderRadius: 2,
        textAlign: 'center',
        mb: 3,
        backgroundColor: '#fafafa',
      }}
    >
      <Typography variant="h6" gutterBottom>
        Arrastra y suelta tus archivos aquí
      </Typography>
      <Typography variant="body2" gutterBottom>
        o haz clic en el botón para seleccionarlos manualmente
      </Typography>
      <Button
        variant="contained"
        component="label"
        sx={{
          mt: 2,
          backgroundColor: '#33691e',
          '&:hover': { backgroundColor: '#2e7d32' },
        }}
      >
        Elegir archivo(s)
        <input
          type="file"
          hidden
          multiple
          accept=".xls,.xlsx"
          onChange={handleChange}
        />
      </Button>
    </Box>
  );
};

export default UploadFile;