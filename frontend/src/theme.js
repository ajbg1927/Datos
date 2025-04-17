import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0a5d3c', 
    },
    secondary: {
      main: '#ffd600', 
    },
    background: {
      default: '#ffffff',
    },
    text: {
      primary: '#000000',
    },
  },
  typography: {
    fontFamily: 'Poppins, Roboto, sans-serif',
  },
});

export default theme;