import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Divider,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const UploadFile = ({ onFilesUploaded }) => {
  const handleDrop = (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      onFilesUploaded(Array.from(files));
    }
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      onFilesUploaded(Array.from(files));
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <Paper
      elevation={4}
      sx={{
        p: 4,
        textAlign: 'center',
        border: '2px dashed #ccc',
        bgcolor: '#fafafa',
        cursor: 'pointer',
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <CloudUploadIcon sx={{ fontSize: 50, color: '#777' }} />
      <Typography variant="h6" sx={{ mt: 2 }}>
        Arrastra o pega un archivo aquí
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Button variant="contained" component="label">
        Elegir archivo
        <input hidden type="file" multiple onChange={handleFileChange} />
      </Button>
    </Paper>
  );
};

export default UploadFile;