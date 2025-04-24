import React from 'react';
import { Box, Typography, Button, Input } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const UploadFile = ({ onFilesUploaded }) => {
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0 && typeof onFilesUploaded === 'function') {
      onFilesUploaded(files); 
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && typeof onFilesUploaded === 'function') {
      onFilesUploaded(files); 
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <Box
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      sx={{
        border: '2px dashed #388E3C',
        borderRadius: 4,
        backgroundColor: '#ffffff',
        p: 6,
        textAlign: 'center',
        boxShadow: 4,
        transition: '0.3s',
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: '#F9FBE7',
          boxShadow: 6,
        },
      }}
    >
      <CloudUploadIcon sx={{ fontSize: 80, color: '#388E3C', mb: 2 }} />
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Arrastra y suelta tus archivos Excel aquí
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        o haz clic en el botón para seleccionarlos desde tu equipo
      </Typography>

      <label htmlFor="upload-file">
        <Input
          id="upload-file"
          type="file"
          inputProps={{ multiple: true, accept: '.xlsx, .xls' }}
          onChange={handleFileChange}
          sx={{ display: 'none' }}
        />
        <Button
          variant="contained"
          component="span"
          size="large"
          sx={{
            mt: 3,
            px: 5,
            py: 1.5,
            fontWeight: 'bold',
            borderRadius: 2,
            backgroundColor: '#FFEB3B',
            color: '#000',
            '&:hover': {
              backgroundColor: '#FDD835',
            },
          }}
        >
          Seleccionar archivos
        </Button>
      </label>
    </Box>
  );
};

export default UploadFile;