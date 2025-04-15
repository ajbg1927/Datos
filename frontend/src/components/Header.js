import React from 'react';
import { AppBar, Toolbar, Typography, Box, useMediaQuery, useTheme } from '@mui/material';

function Header() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); 

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: '#fff',
        color: '#000',
        boxShadow: 1,
        paddingX: isMobile ? 1 : 3,
        paddingY: 1,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <Box
          component="img"
          src="/logo_am.png"
          alt="Logo Municipio"
          sx={{
            height: isMobile ? 40 : 60,
            marginRight: 2,
          }}
        />

        <Typography
          variant={isMobile ? 'body1' : 'h6'}
          component="div"
          align="center"
          sx={{
            fontWeight: 600,
            flexGrow: 1,
            textAlign: 'center',
            fontSize: isMobile ? '1rem' : '1.25rem',
          }}
        >
          Análisis de Datos – Municipio de Mosquera
        </Typography>

        <Box
          component="img"
          src="/logo_tic.png"
          alt="Logo TIC Mosquera"
          sx={{
            height: isMobile ? 35 : 50,
            marginLeft: 2,
          }}
        />
      </Toolbar>
    </AppBar>
  );
}

export default Header;
