import React from 'react';
import { Paper, Typography, Button, Divider } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const UploadFile = ({ onFilesUploaded }) => {
  const fileInputRef = React.useRef();

  const isExcelFile = (file) =>
    file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    file.type === 'application/vnd.ms-excel';

  const handleFiles = (files) => {
    const validFiles = Array.from(files).filter(isExcelFile);
    if (validFiles.length > 0) {
      if (typeof onFilesUploaded === 'function') {
        onFilesUploaded(validFiles);
      } else {
        console.error('❌ onFilesUploaded no es una función:', onFilesUploaded);
      }
    } else {
      alert('Por favor sube archivos Excel (.xlsx o .xls)');
    }
  };

  const handleFileChange = (e) => {
    handleFiles(e.target.files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
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
        transition: 'background-color 0.3s',
        '&:hover': { bgcolor: '#f0f0f0' },
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
        <input
          hidden
          type="file"
          multiple
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          ref={fileInputRef}
        />
      </Button>
    </Paper>
  );
};

export default UploadFile;