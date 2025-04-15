import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const DragDropArea = styled(Box)(({ theme }) => ({
  border: '2px dashed #ccc',
  padding: theme.spacing(6),
  textAlign: 'center',
  cursor: 'pointer',
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: '#ffffff',
  color: '#444',
  transition: 'all 0.3s ease',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  '&:hover': {
    borderColor: '#00c853',
    backgroundColor: '#f9f9f9',
  },
}));

const handleFileUpload = (event) => {
  const uploadedFiles = Array.from(event.target.files);
  const validFiles = uploadedFiles.filter(file => file.type.includes('excel') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls'));

  if (validFiles.length > 0) {
    onFilesUploaded(validFiles);
  } else {
    alert('Por favor, selecciona archivos Excel válidos (.xlsx, .xls)');
  }
};

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    onFilesUploaded(droppedFiles);
  };

  return (
    <DragDropArea onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
      <UploadFileIcon sx={{ fontSize: 60, color: '#00c853', mb: 2 }} />
      <Typography variant="h6" gutterBottom sx={{ color: '#333' }}>
        Arrastra o pega un archivo aquí
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, color: '#666' }}>
        o haz clic para seleccionar manualmente
      </Typography>
      <Button
        variant="contained"
        component="label"
        startIcon={<CloudUploadIcon />}
        sx={{
          backgroundColor: '#ffcd00',
          color: '#000',
          fontWeight: 'bold',
          paddingX: 4,
          '&:hover': {
            backgroundColor: '#e6b800',
          },
        }}
      >
        Seleccionar archivo
        <input type="file" hidden multiple onChange={handleFileUpload} />
      </Button>
    </DragDropArea>
  );
};

export default UploadFile;
