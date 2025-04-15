import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Container, Box } from '@mui/material';

const Layout = ({ children }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh"
      bgcolor="#f5f5f5"
    >
      <Header />

      <Container
        maxWidth="xl"
        sx={{
          flexGrow: 1,
          py: 3,
        }}
      >
        {children}
      </Container>

      <Footer />
    </Box>
  );
};

export default Layout;
