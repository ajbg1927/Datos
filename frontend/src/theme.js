import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1B5E20', 
    },
    secondary: {
      main: '#FDD835', 
    },
    background: {
      default: '#FFFFFF', 
    },
    text: {
      primary: '#000000', 
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

export default theme;
