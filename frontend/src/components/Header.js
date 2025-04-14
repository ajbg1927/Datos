import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';

const Header = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#1B5E20' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img
            src="/logo_mosquera.png" 
            alt="Logo Municipio de Mosquera"
            style={{ height: 50, marginRight: 16 }}
          />
          <Typography variant="h6" component="div">
            Análisis de Datos – Municipio de Mosquera
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

