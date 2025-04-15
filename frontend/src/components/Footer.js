import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Box } from '@mui/material';
import { Facebook, YouTube, Twitter, Instagram } from '@mui/icons-material';

const Footer = () => {
  const redesSociales = [
    {
      icon: <Facebook sx={{ color: 'white' }} />, nombre: '@AlcaldiaDeMosquera', url: 'https://www.facebook.com/AlcaldiaDeMosquera/'
    },
    {
      icon: <YouTube sx={{ color: 'white' }} />, nombre: '@Mosqueratv', url: 'https://www.youtube.com/user/Mosqueratv'
    },
    {
      icon: <Twitter sx={{ color: 'white' }} />, nombre: '@AlcMosquera', url: 'https://x.com/alcmosquera'
    },
    {
      icon: <Instagram sx={{ color: 'white' }} />, nombre: '@alcaldiademosquera', url: 'https://www.instagram.com/alcaldiademosquera/?hl=es-la'
    },
  ];

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#f5f5f5',
        padding: '2rem 0',
        marginTop: 'auto',
        textAlign: 'center',
        borderTop: '1px solid #ddd',
      }}
    >
      <Typography variant="body2" sx={{ mb: 2, fontWeight: 'bold', color: '#444' }}>
        Redes sociales oficiales del Municipio de Mosquera
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        {redesSociales.map((red, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                color: '#333',
              }}
            >
              <Box
                sx={{
                  backgroundColor: '#4d9400',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {red.icon}
              </Box>
              <a href={red.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#333', fontSize: '0.9rem' }}>
                {red.nombre}
              </a>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Footer;

