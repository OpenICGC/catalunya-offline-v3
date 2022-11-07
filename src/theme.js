import createTheme from '@mui/material/styles/createTheme';
import {lighten} from '@mui/system/colorManipulator';

const primaryColor = '#f59d21';

const theme = mode => createTheme({
  palette: {
    mode: mode ? mode : 'light',
    primary: {
      main: primaryColor,
      contrastText: '#fff',
    },
    secondary: {
      main: '#ffd300',
    },
    tertiary: {
      main: '#23A649',
      light: '#4FB76D',
      dark: '#187433'
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
