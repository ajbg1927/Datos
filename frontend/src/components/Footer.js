import React from 'react';
import { Box, Grid, Typography, Link } from '@mui/material';
import { Facebook, Twitter, Instagram, YouTube } from '@mui/icons-material';

const Footer = () => {
  const iconStyle = {
    backgroundColor: '#4B8B1D',
    borderRadius: '50%',
    color: 'white',
    padding: 8,
    fontSize: 32,
  };

  return (
    <Box sx={{ backgroundColor: '#ffffff', p: 4, mt: 4 }}>
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={6} md={3}>
          <Box display="flex" alignItems="center">
            <Facebook sx={iconStyle} />
            <Typography sx={{ ml: 1 }}>@AlcaldiaDeMosquera</Typography>
          </Box>
          <Box display="flex" alignItems="center" mt={1}>
            <YouTube sx={iconStyle} />
            <Typography sx={{ ml: 1 }}>@Mosqueratv</Typography>
          </Box>
        </Grid>

        <Grid item xs={6} md={3}>
          <Box display="flex" alignItems="center">
            <Twitter sx={iconStyle} />
            <Typography sx={{ ml: 1 }}>@AlcMosquera</Typography>
          </Box>
          <Box display="flex" alignItems="center" mt={1}>
            <Instagram sx={iconStyle} />
            <Typography sx={{ ml: 1 }}>@alcaldiademosquera</Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Footer;
