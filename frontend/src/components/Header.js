import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import logo from '../../public/logo_am.png'; // Asegúrate que el path esté bien

function Header() {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#fff', color: '#000', boxShadow: 1 }}>
      <Toolbar sx={{ justifyContent: 'center', gap: 2, position: 'relative' }}>
        {/* Logo izquierda */}
        <Box
          component="img"
          src="/logo_am.png"
          alt="Logo"
          sx={{
            height: 60,
            position: 'absolute',
            left: 16,
          }}
        />
        {/* Título centrado */}
        <Typography variant="h6" component="div" align="center" sx={{ fontWeight: 600 }}>
          Análisis de Datos – Municipio de Mosquera
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
