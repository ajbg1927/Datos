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
              height: { xs: 50, sm: 70, md: 90 },
              maxWidth: '100%',
              mr: 2,
            }}
          />

          <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
            <Typography
              variant={isMobile ? 'h6' : 'h4'}
              sx={{
                fontWeight: 700,
                fontSize: { xs: '1.2rem', sm: '1.8rem', md: '2rem' },
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                color: '#000',
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
              height: { xs: 45, sm: 65, md: 85 },
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