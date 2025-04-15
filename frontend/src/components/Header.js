import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material';

function Header() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      <AppBar
        position="static"
        sx={{
          backgroundColor: '#fff',
          color: '#000',
          boxShadow: 1,
          px: isMobile ? 1 : 3,
          py: 1,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
          <Box
            component="img"
            src="/logo_am.png"
            alt="Logo Municipio"
            sx={{
              height: { xs: 35, sm: 45, md: 60 },
              maxWidth: '100%',
              mr: 2,
            }}
          />

          <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
            <Typography
              variant={isMobile ? 'body1' : 'h6'}
              sx={{
                fontWeight: 600,
                fontSize: { xs: '1rem', sm: '1.2rem' },
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              Análisis de Datos Excel
            </Typography>
          </Box>

          <Box
            component="img"
            src="/logo_tic.png"
            alt="Logo TIC Mosquera"
            sx={{
              height: { xs: 30, sm: 40, md: 50 },
              maxWidth: '100%',
              ml: 2,
            }}
          />
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          height: 3,
          backgroundColor: '#e0e0e0',
          width: '100%',
        }}
      />
    </>
  );
}

export default Header;
