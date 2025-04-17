import React, { useRef, useState } from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const UploadFile = ({ onArchivosSeleccionados }) => {
  const inputRef = useRef();
  const [arrastrando, setArrastrando] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setArrastrando(false);
    const archivos = Array.from(e.dataTransfer.files);
    if (archivos.length) {
      onArchivosSeleccionados(archivos);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setArrastrando(true);
  };

  const handleDragLeave = () => {
    setArrastrando(false);
  };

  const handleArchivoSeleccionado = (e) => {
    const archivos = Array.from(e.target.files);
    if (archivos.length) {
      onArchivosSeleccionados(archivos);
    }
  };

  return (
    <Paper
      elevation={arrastrando ? 6 : 2}
      sx={{
        border: arrastrando ? '2px dashed #388e3c' : '2px dashed #ccc',
        borderRadius: 2,
        padding: 4,
        textAlign: 'center',
        backgroundColor: arrastrando ? '#f1f8e9' : 'inherit',
        cursor: 'pointer',
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => inputRef.current.click()}
    >
      <CloudUploadIcon sx={{ fontSize: 50, color: '#388e3c' }} />
      <Typography variant="h6" mt={2}>
        Arrastra y suelta archivos aquí o haz clic para seleccionarlos
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Puedes subir múltiples archivos Excel (.xlsx)
      </Typography>
      <input
        ref={inputRef}
        type="file"
        hidden
        multiple
        onChange={handleArchivoSeleccionado}
      />
    </Paper>
  );
};

export default UploadFile;