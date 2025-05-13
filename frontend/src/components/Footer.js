import React from 'react';
import { Grid, Typography, Box } from '@mui/material';
import { Facebook, YouTube, Twitter, Instagram } from '@mui/icons-material';

const Footer = () => {
  const redesSociales = [
    {
      icon: <Facebook sx={{ color: '#fff', fontSize: 18 }} />,
      nombre: '@AlcaldiaDeMosquera',
      url: 'https://www.facebook.com/AlcaldiaDeMosquera/',
    },
    {
      icon: <YouTube sx={{ color: '#fff', fontSize: 18 }} />,
      nombre: '@Mosqueratv',
      url: 'https://www.youtube.com/user/Mosqueratv',
    },
    {
      icon: <Twitter sx={{ color: '#fff', fontSize: 18 }} />,
      nombre: '@AlcMosquera',
      url: 'https://x.com/alcmosquera',
    },
    {
      icon: <Instagram sx={{ color: '#fff', fontSize: 18 }} />,
      nombre: '@alcaldiademosquera',
      url: 'https://www.instagram.com/alcaldiademosquera/?hl=es-la',
    },
  ];

  return (
    <>
      <Box sx={{ height: 3, backgroundColor: '#e0e0e0', width: '100%' }} />

      <Box
        component="footer"
        sx={{
          backgroundColor: '#fafafa',
          py: 4,
          textAlign: 'center',
          mt: 'auto',
        }}
      >
        <Typography
          variant="body2"
          sx={{ mb: 3, fontWeight: 600, color: '#444', fontSize: '1rem' }}
        >
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
                  '&:hover a': { color: '#4d9400' },
                }}
              >
                <Box
                  sx={{
                    backgroundColor: '#4d9400',
                    borderRadius: '50%',
                    width: 26,
                    height: 26,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background-color 0.3s',
                    '&:hover': { backgroundColor: '#3a7300' },
                  }}
                >
                  {red.icon}
                </Box>
                <a
                  href={red.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    textDecoration: 'none',
                    color: '#333',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                  }}
                >
                  {red.nombre}
                </a>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 5 }}>
        <Typography
            variant="body2"
            sx={{
              fontFamily: "'Dancing Script', cursive",
              color: '#777',
              fontSize: '1rem',
            }}
          >
            Dirección de las TIC
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontFamily: "'Dancing Script', cursive",
              color: '#777',
              fontSize: '1rem',
            }}
          >
            Desarrollo: Angie Julieth Barreto Guerrero
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontFamily: "'Dancing Script', cursive",
              color: '#aaa',
              fontSize: '0.95rem',
            }}
          >
            Ingeniera de Software
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default Footer;
