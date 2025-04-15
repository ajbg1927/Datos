import React from 'react';
import { Box, Typography } from '@mui/material';

const Header = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#007C3B',
        color: '#fff',
        padding: '10px 20px',
      }}
    >
      <img
        src="/logo_am.png"
        alt="Logo"
        style={{ height: 50, marginRight: 20 }}
      />
      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
        Análisis de Datos – Municipio de Mosquera
      </Typography>
    </Box>
  );
};

export default Header;
