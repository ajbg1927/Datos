import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';

const Header = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#ffffff', color: '#000000', boxShadow: 1 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        {/* Logo a la izquierda */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img
            src="/logo_am.png"
            alt="Logo Municipio de Mosquera"
            style={{ height: 50, marginRight: 16 }}
          />
        </Box>

        {/* Texto centrado */}
        <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: 'bold', fontSize: { xs: '16px', sm: '20px' } }}
          >
            Análisis de Datos – Municipio de Mosquera
          </Typography>
        </Box>

        {/* Espacio vacío a la derecha para centrar bien el texto */}
        <Box sx={{ width: 66 }} /> 
      </Toolbar>
    </AppBar>
  );
};

export default Header;


