import createTheme from '@mui/material/styles/createTheme';
import {lighten} from '@mui/material';

const primaryColor = '#f59d21';

const theme = mode => createTheme({
  palette: {
    mode: mode ? mode : 'light',
    primary: {
      main: primaryColor,
      contrastText: '#FFF',
    },
    secondary: {
      main: '#ffd300',
    },
    text: {
      primary: '#311f06',
      secondary: '#623e0d',
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        /* Firefox Scrollbar */
        'body': {
          scrollbarColor: `${lighten(primaryColor, 0.5)} transparent`, /* scroll thumb and track */
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
          backgroundColor: lighten(primaryColor, 0.5),
          opacity: 0.2,
          outline: '0px solid slategrey'
        }
      }
    }
  }
});

export default theme;
