import React from 'react';
import { Box, Typography, Button, Input } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';

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
        border: '2px dashed #ccc',
        borderRadius: 4,
        p: 4,
        textAlign: 'center',
        my: 4,
        backgroundColor: '#f9f9f9',
        cursor: 'pointer',
      }}
    >
      <UploadFileIcon sx={{ fontSize: 40, mb: 2, color: 'primary.main' }} />
      <Typography variant="h6" gutterBottom>
        Arrastra o pega archivos Excel aquí
      </Typography>
      <Typography variant="body2" gutterBottom>
        También puedes seleccionarlos manualmente
      </Typography>

      <label htmlFor="upload-file">
        <Input
          id="upload-file"
          type="file"
          inputProps={{ multiple: true, accept: '.xlsx, .xls' }}
          onChange={handleFileChange}
          sx={{ display: 'none' }}
        />
        <Button variant="contained" component="span" sx={{ mt: 2 }}>
          Seleccionar archivos
        </Button>
      </label>
    </Box>
  );
};

export default UploadFile;