import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';

const Header = () => {
  return (
    <AppBar position="static" elevation={0} sx={{ backgroundColor: '#ffffff', borderBottom: '2px solid #e0e0e0' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box display="flex" alignItems="center">
          <img
            src="/logo AM.png"
            alt="Logo Municipio de Mosquera"
            style={{ height: 64, marginRight: 16 }}
          />
        </Box>
        <Typography variant="h6" sx={{ color: '#222', fontWeight: 600 }}>
          Análisis de Datos – Municipio de Mosquera
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;


