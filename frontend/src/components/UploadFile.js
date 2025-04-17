import React from 'react';
import { Box, Typography, Button, Input } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const UploadFile = ({ onFilesUploaded }) => {
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      onFilesUploaded(files);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
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
        border: '2px dashed #A9A9A9',
        borderRadius: 3,
        backgroundColor: '#fefefe',
        p: 6,
        textAlign: 'center',
        boxShadow: 3,
        transition: '0.3s ease',
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: '#F4F4F4',
          boxShadow: 6,
        },
      }}
    >
      <CloudUploadIcon sx={{ fontSize: 70, color: '#388E3C', mb: 2 }} />
      <Typography variant="h6" fontWeight="bold" color="text.primary" gutterBottom>
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
          size="medium"
          sx={{
            mt: 3,
            px: 4,
            py: 1,
            fontWeight: 'bold',
            borderRadius: 2,
            backgroundColor: '#FFC107',
            color: '#000',
            '&:hover': {
              backgroundColor: '#FFB300',
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