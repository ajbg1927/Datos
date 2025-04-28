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
        <Grid container spacing={3} sx={{ height: '100%' }}>
          {sidebar && (
            <Grid item xs={12} md={3}>
              <Paper
                elevation={1}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  backgroundColor: 'white',
                  height: '100%',
                }}
              >
                {sidebar}
              </Paper>
            </Grid>
          )}

          <Grid item xs={12} md={sidebar ? 9 : 12} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Paper
              elevation={1}
              sx={{
                p: 3,
                borderRadius: 3,
                backgroundColor: 'white',
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box sx={{ overflowY: 'auto', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ flexGrow: 1 }}>
                  {children}
                </Box>

                <Box sx={{ mt: 2 }}>
                  {React.Children.toArray(children).find(child => child?.type?.name === 'ExportButtons')}
                </Box>
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