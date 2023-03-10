import ReactDOM from 'react-dom';
import React from 'react';

import Routes from './routes/routes';

import ThemeProvider from '@mui/material/styles/ThemeProvider';
import StyledEngineProvider from '@mui/material/StyledEngineProvider';

import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';

import './i18n';

/*import LangSetter from './views/LangSetter';*/

const App = () =>
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={theme()}>
      <CssBaseline/>
      {/*<LangSetter>*/}
      <Routes/>
      {/*</LangSetter>*/}
    </ThemeProvider>
  </StyledEngineProvider>;

const target = document.getElementById('app');
if (target) ReactDOM.render(<App/>, target);

export default App;
