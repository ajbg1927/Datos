import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2', // azul profesional
    },
    secondary: {
      main: '#1565c0', // azul oscuro para contrastes
    },
    background: {
      default: '#f4f6f8', // fondo claro y moderno
      paper: '#ffffff',   // blanco para las tarjetas
    },
    text: {
      primary: '#212121',
      secondary: '#424242',
    },
  },
  typography: {
    fontFamily: ['"Roboto"', 'sans-serif'].join(','),
    h4: {
      fontWeight: 600,
      color: '#1565c0',
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        },
      },
    },
  },
});

export default theme;