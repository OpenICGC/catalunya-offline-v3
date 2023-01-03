import createTheme from '@mui/material/styles/createTheme';
import {PaletteMode} from '@mui/material';

const primaryColor = '#f59d21';

const theme = (mode?: PaletteMode) => createTheme({
  palette: {
    mode: mode ? mode : 'light',
    primary: {
      main: primaryColor,
      contrastText: '#fff',
    },
    secondary: {
      main: '#ffd300',
    },
    text: {
      primary: '#000000',
      secondary: 'rgba(0,0,0,0.65)',
    }
  },
  typography: {
    h2: {
      fontSize: '1.25rem'
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        /* Firefox Scrollbar */
        'body': {
          scrollbarColor: 'lightgrey', /* scroll thumb and track */
          scrollbarWidth: '2px'
        },
        /* Chrome Scrollbar */
        '*::-webkit-scrollbar': {
          width: '0.2em',
          height: '0.15em'
        },
        '*::-webkit-scrollbar-track': {
          WebkitBoxShadow: 'inset 0 0 2px rgba(0,0,0,0.00)'
        },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: 'lightgrey',
          opacity: 0.2,
          outline: '0px solid slategrey'
        },
        '.vega-embed': {
          width: '100%'
        }
      },
    },
    MuiTypography: {
      styleOverrides: {
        gutterBottom: {
          marginBottom: 16,
        },
      },
    },
  }
});

export default theme;
