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
        border: '2px dashed #BDBDBD',
        borderRadius: 3,
        backgroundColor: '#FAFAF5',
        p: 6,
        textAlign: 'center',
        boxShadow: 1,
        transition: '0.3s',
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: '#F5F5F0',
          boxShadow: 3,
        },
      }}
    >
      <CloudUploadIcon sx={{ fontSize: 80, color: '#616161', mb: 2 }} />
      <Typography variant="h6" fontWeight="bold" color="#333" gutterBottom>
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
            backgroundColor: '#424242',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#2E2E2E',
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