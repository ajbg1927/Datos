import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';

function Header() {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#fff', color: '#000', boxShadow: 1 }}>
      <Toolbar sx={{ justifyContent: 'center', gap: 2, position: 'relative' }}>

        <Box
          component="img"
          src="/logo_am.png"
          alt="Logo Municipio"
          sx={{
            height: 60,
            position: 'absolute',
            left: 16,
          }}
        />

        <Typography variant="h6" component="div" align="center" sx={{ fontWeight: 600 }}>
          Análisis de Datos – Municipio de Mosquera
        </Typography>

        <Box
          component="img"
          src="/logo_tic.png"
          alt="Logo TIC Mosquera"
          sx={{
            height: 50,
            position: 'absolute',
            right: 16,
          }}
        />

      </Toolbar>
    </AppBar>
  );
}

export default Header;

