import React, { useState } from 'react';
import { Box, Button, Typography, LinearProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { subirArchivoExcel } from '../services/api';

const UploadFile = ({ onUploadSuccess }) => {
  const [archivo, setArchivo] = useState(null);
  const [subiendo, setSubiendo] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const handleFileChange = (e) => {
    setArchivo(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!archivo) {
      setMensaje("Selecciona un archivo primero.");
      return;
    }
    setSubiendo(true);
    setMensaje("");
    try {
      await subirArchivoExcel(archivo);
      setMensaje("Archivo subido con éxito.");
      onUploadSuccess();
      setArchivo(null);
    } catch (error) {
      setMensaje("Error al subir el archivo.");
    }
    setSubiendo(false);
  };

  return (
    <Box sx={{ mb: 4 }}>
      <input
        type="file"
        accept=".xls,.xlsx"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id="upload-input"
      />
      <label htmlFor="upload-input">
        <Button
          variant="contained"
          component="span"
          startIcon={<CloudUploadIcon />}
        >
          Seleccionar archivo
        </Button>
      </label>
      <Button
        variant="outlined"
        sx={{ ml: 2 }}
        onClick={handleUpload}
        disabled={subiendo}
      >
        Subir
      </Button>
      {subiendo && <LinearProgress sx={{ mt: 2 }} />}
      {mensaje && <Typography sx={{ mt: 2 }}>{mensaje}</Typography>}
    </Box>
  );
};

export default UploadFile;
