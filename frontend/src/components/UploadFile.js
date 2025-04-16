import React, { useRef } from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const UploadFile = ({ onUpload }) => {
  const fileInputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onUpload(files[0]);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onUpload(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <Paper
      elevation={3}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      sx={{
        p: 3,
        border: '2px dashed #ccc',
        textAlign: 'center',
        backgroundColor: '#f9f9f9',
        mb: 2,
        cursor: 'pointer'
      }}
      onClick={() => fileInputRef.current.click()}
    >
      <CloudUploadIcon sx={{ fontSize: 40, color: '#4caf50' }} />
      <Typography variant="h6" gutterBottom>
        Arrastra o selecciona un archivo Excel aquí
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Solo se permite un archivo a la vez
      </Typography>
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </Paper>
  );
};

export default UploadFile;
