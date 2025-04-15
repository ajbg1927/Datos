import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';

const Header = () => {
  return (
    <AppBar position="static" elevation={0} sx={{ backgroundColor: '#ffffff', borderBottom: '2px solid #e0e0e0' }}>
      <Toolbar sx={{ justifyContent: 'center' }}>
        <Box display="flex" alignItems="center">
          <img
            src="/logo_am.png"
            alt="Logo Municipio de Mosquera"
            style={{ height: 48, marginRight: 12 }}
          />
          <Typography variant="h6" sx={{ color: '#222', fontWeight: 600 }}>
            Análisis de Datos – Municipio de Mosquera
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
