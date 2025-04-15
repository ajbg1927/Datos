import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const DragDropArea = styled('div')(({ theme }) => ({
  border: '2px dashed #ccc',
  padding: theme.spacing(4),
  textAlign: 'center',
  cursor: 'pointer',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: '#f9f9f9',
  color: '#888',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: '#f1f1f1',
  },
}));

const UploadFile = ({ onFilesUploaded }) => {
  const handleFileUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    onFilesUploaded(uploadedFiles);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    onFilesUploaded(droppedFiles);
  };

  return (
    <DragDropArea onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
      <UploadFileIcon sx={{ fontSize: 40 }} />
      <Typography variant="body1" gutterBottom>
        Arrastra o pega un archivo aquí
      </Typography>
      <Button variant="contained" component="label" startIcon={<CloudUploadIcon />}>
        Elegir archivo
        <input type="file" hidden multiple onChange={handleFileUpload} />
      </Button>
    </DragDropArea>
  );
};

export default UploadFile;
