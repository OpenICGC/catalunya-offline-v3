import ReactDOM from 'react-dom';
import React from 'react';

import MainView from './views';

import ThemeProvider from '@mui/material/styles/ThemeProvider';

import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';

import './i18n';

import LangSetter from './views/LangSetter';

const App = () =>
  <ThemeProvider theme={theme}>
    <CssBaseline/>
    <LangSetter>
      <MainView/>
    </LangSetter>
  </ThemeProvider>;

const target = document.getElementById('app');
if (target) ReactDOM.render(<App/>, target);

export default App;
