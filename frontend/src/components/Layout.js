import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Container, Box, Grid, Paper } from '@mui/material';

const Layout = ({ children, sidebar }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh"
      bgcolor="#f5f5f5"
    >
      <Header />

      <Container maxWidth="xl" sx={{ flexGrow: 1, py: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
              {sidebar}
            </Paper>
          </Grid>

          <Grid item xs={12} md={9}>
            {children}
          </Grid>
        </Grid>
      </Container>

      <Footer />
    </Box>
  );
};

export default Layout;