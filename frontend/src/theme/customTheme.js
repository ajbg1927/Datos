import { createTheme } from '@mui/material/styles';

const customTheme = createTheme({
  palette: {
    primary: {
      main: '#4caf50', 
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#fdd835', 
      contrastText: '#000000',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#212121',
      secondary: '#424242',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Segoe UI", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '8px 16px',
          boxShadow: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

export default customTheme;