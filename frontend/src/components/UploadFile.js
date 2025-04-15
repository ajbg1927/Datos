import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Button, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

function UploadFile({ onFilesUploaded }) {
  const onDrop = useCallback(
    (acceptedFiles) => {
      const validFiles = acceptedFiles.filter(
        (file) =>
          file.type ===
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
          file.type === 'application/vnd.ms-excel'
      );

      if (typeof onFilesUploaded === 'function') {
        onFilesUploaded(validFiles);
      } else {
        console.error('Error: onFilesUploaded no es una función');
      }
    },
    [onFilesUploaded]
  );

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
  });

  return (
    <Box
      {...getRootProps()}
      sx={{
        border: '2px dashed #ccc',
        padding: 4,
        textAlign: 'center',
        borderRadius: 2,
        backgroundColor: '#f9f9f9',
        mb: 4,
      }}
    >
      <input {...getInputProps()} />
      <CloudUploadIcon sx={{ fontSize: 50, color: '#888' }} />
      <Typography variant="h6" sx={{ mt: 2 }}>
        Arrastra y suelta archivos Excel aquí, o
      </Typography>
      <Button
        variant="contained"
        onClick={open}
        sx={{
          mt: 2,
          backgroundColor: '#2e7d32',
          '&:hover': { backgroundColor: '#1b5e20' },
        }}
      >
        Seleccionar archivo
      </Button>
    </Box>
  );
}

export default UploadFile;