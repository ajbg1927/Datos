import React, { useRef } from 'react';
import { Box, Typography, Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const UploadFile = ({ onFilesUploaded }) => {
  const inputRef = useRef(null);

  const handleChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length && typeof onFilesUploaded === 'function') {
      onFilesUploaded(files);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length && typeof onFilesUploaded === 'function') {
      onFilesUploaded(files);
    }
  };

  const handlePaste = (e) => {
    const files = Array.from(e.clipboardData.files);
    if (files.length && typeof onFilesUploaded === 'function') {
      onFilesUploaded(files);
    }
  };

  return (
    <Box
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onPaste={handlePaste}
      sx={{
        border: '2px dashed #cfd8dc',
        padding: 3,
        borderRadius: 2,
        textAlign: 'center',
        mb: 3,
        backgroundColor: '#f1f8e9',
        color: '#33691e',
        cursor: 'pointer',
        transition: '0.3s ease',
        '&:hover': {
          backgroundColor: '#e6ee9c',
        },
      }}
      onClick={() => inputRef.current && inputRef.current.click()}
    >
      <CloudUploadIcon sx={{ fontSize: 50, mb: 1 }} />
      <Typography variant="h6" gutterBottom>
        Arrastra, pega o suelta tus archivos aquí
      </Typography>
      <Typography variant="body2" gutterBottom>
        o haz clic para seleccionar archivo(s) desde tu dispositivo
      </Typography>

      <input
        ref={inputRef}
        type="file"
        hidden
        multiple
        accept=".xls,.xlsx"
        onChange={handleChange}
      />
      <Button
        variant="contained"
        sx={{
          mt: 2,
          backgroundColor: '#33691e',
          '&:hover': { backgroundColor: '#2e7d32' },
        }}
        onClick={() => inputRef.current && inputRef.current.click()}
      >
        Seleccionar archivo(s)
      </Button>
    </Box>
  );
};

export default UploadFile;