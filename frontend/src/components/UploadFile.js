import React from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Button,
  Typography,
  Paper,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const UploadFile = ({ onFilesUploaded }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      onFilesUploaded(acceptedFiles);
    },
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
  });

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        textAlign: 'center',
        backgroundColor: '#f9f9f9',
        border: '2px dashed #ccc',
        borderRadius: 2,
        mt: 4,
      }}
    >
      <Box {...getRootProps()} sx={{ cursor: 'pointer', mb: 4 }}>
        <input {...getInputProps()} />
        <CloudUploadIcon sx={{ fontSize: 60, color: '#888' }} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          {isDragActive ? 'Suelta los archivos aquí...' : 'Arrastra o pega un archivo aquí'}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          o haz clic en el botón de abajo para seleccionar archivos desde tu equipo
        </Typography>
      </Box>

      <Button
        variant="contained"
        component="label"
        color="primary"
        sx={{ mt: 2 }}
      >
        Elegir archivo
        <input
          type="file"
          hidden
          multiple
          onChange={(e) => onFilesUploaded([...e.target.files])}
          accept=".xlsx,.xls"
        />
      </Button>
    </Paper>
  );
};

export default UploadFile;