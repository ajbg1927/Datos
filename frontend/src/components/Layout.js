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
      bgcolor="#f0f2f5" 
    >
      <Header />

      <Container maxWidth="xl" sx={{ flexGrow: 1, py: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Paper
              elevation={1}
              sx={{
                p: 3,
                height: '100%',
                borderRadius: 3,
                backgroundColor: 'white',
              }}
            >
              {sidebar}
            </Paper>
          </Grid>

          <Grid item xs={12} md={9}>
            <Paper
              elevation={1}
              sx={{
                p: 3,
                height: '100%',
                borderRadius: 3,
                backgroundColor: 'white',
              }}
            >
              <Box sx={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                {children}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <Footer />
    </Box>
  );
};

export default Layout;