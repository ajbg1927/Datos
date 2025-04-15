// UploadFile.js
import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import UploadFileIcon from '@mui/icons-material/UploadFile';

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

const UploadFile = ({ handleFileUpload, handleDrop }) => {
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


// Header.js
import React from 'react';
import { Box, Typography } from '@mui/material';
import logo from '../../public/logo_am.png';

const Header = () => {
  return (
    <Box
      sx={{
        bgcolor: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        borderBottom: '2px solid #eee',
      }}
    >
      <Box component="img" src={logo} alt="Logo" sx={{ height: 60, mr: 2 }} />
      <Typography variant="h5" fontWeight="bold" textAlign="center">
        Análisis de Datos – Municipio de Mosquera
      </Typography>
    </Box>
  );
};

export default Header;


// Footer.js
import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box sx={{ bgcolor: '#f4f4f4', mt: 5, py: 2, textAlign: 'center', fontSize: 12 }}>
      <Typography variant="body2" gutterBottom>
        © {new Date().getFullYear()} Municipio de Mosquera
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        <a href="https://www.facebook.com/AlcaldiaDeMosquera/" target="_blank" rel="noopener noreferrer">Facebook</a>
        <a href="https://www.youtube.com/user/Mosqueratv" target="_blank" rel="noopener noreferrer">YouTube</a>
        <a href="https://x.com/alcmosquera" target="_blank" rel="noopener noreferrer">Twitter</a>
        <a href="https://www.instagram.com/alcaldiademosquera/?hl=es-la" target="_blank" rel="noopener noreferrer">Instagram</a>
      </Box>
    </Box>
  );
};

export default Footer;


