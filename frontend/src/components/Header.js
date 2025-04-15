import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';

function Header() {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#006400' }}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <img
            src="/logo_am.png"
            alt="Logotipo del Municipio de Mosquera"
            style={{ height: '40px', marginRight: '10px' }}
          />
          <Typography variant="h6" component="div">
            Análisis de Datos – Municipio de Mosquera
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;


