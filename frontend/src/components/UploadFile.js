import React from 'react';
import { Paper, Typography, Button, Divider } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const UploadFile = ({ onFilesUploaded }) => {
  const fileInputRef = React.useRef();

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(isExcelFile);
    if (validFiles.length > 0) {
      onFilesUploaded(validFiles);
    } else {
      alert('Por favor sube archivos Excel (.xlsx o .xls)');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(isExcelFile);
    if (validFiles.length > 0) {
      onFilesUploaded(validFiles);
    } else {
      alert('Por favor sube archivos Excel (.xlsx o .xls)');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const isExcelFile = (file) =>
    file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    file.type === 'application/vnd.ms-excel';

  return (
    <Paper
      elevation={4}
      sx={{
        p: 4,
        textAlign: 'center',
        border: '2px dashed #ccc',
        bgcolor: '#fafafa',
        cursor: 'pointer',
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
          onChange={handleFileChange}
          accept=".xlsx,.xls"
          ref={fileInputRef}
        />
      </Button>
    </Paper>
  );
};

export default UploadFile;