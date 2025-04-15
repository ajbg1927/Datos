import React from 'react';
import { Box, Typography, Link, Grid } from '@mui/material';
import { Facebook, Twitter, YouTube, Instagram } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box sx={{ backgroundColor: '#ffffff', p: 4, mt: 4 }}>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={6} md={3} display="flex" alignItems="center">
          <Facebook sx={{ color: '#4CAF50', mr: 1, fontSize: 20 }} />
          <Link href="https://www.facebook.com/AlcaldiaDeMosquera/" target="_blank" underline="hover" color="inherit" fontSize={14}>
            @AlcaldiaDeMosquera
          </Link>
        </Grid>
        <Grid item xs={6} md={3} display="flex" alignItems="center">
          <YouTube sx={{ color: '#4CAF50', mr: 1, fontSize: 20 }} />
          <Link href="https://www.youtube.com/user/Mosqueratv" target="_blank" underline="hover" color="inherit" fontSize={14}>
            @Mosqueratv
          </Link>
        </Grid>
        <Grid item xs={6} md={3} display="flex" alignItems="center">
          <Twitter sx={{ color: '#4CAF50', mr: 1, fontSize: 20 }} />
          <Link href="https://x.com/alcmosquera" target="_blank" underline="hover" color="inherit" fontSize={14}>
            @AlcMosquera
          </Link>
        </Grid>
        <Grid item xs={6} md={3} display="flex" alignItems="center">
          <Instagram sx={{ color: '#4CAF50', mr: 1, fontSize: 20 }} />
          <Link href="https://www.instagram.com/alcaldiademosquera/?hl=es-la" target="_blank" underline="hover" color="inherit" fontSize={14}>
            @alcaldiademosquera
          </Link>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Footer;
