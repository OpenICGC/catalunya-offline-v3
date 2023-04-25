import React from 'react';
import ReactDOM from 'react-dom';

import ThemeProvider from '@mui/material/styles/ThemeProvider';
import CssBaseline from '@mui/material/CssBaseline';
import {init as initSentry, makeBrowserOfflineTransport, makeFetchTransport} from '@sentry/react';

import './i18n';
import theme from './theme';
import {PLATFORM} from './config';
import LangSetter from './views/LangSetter';
import MainView from './views/MainView';

if (process.env.SENTRY_DSN) {
  console.log('Initializing Sentry');
  initSentry({
    dsn: process.env.SENTRY_DSN,
    environment: PLATFORM,
    transport: makeBrowserOfflineTransport(makeFetchTransport)
  });
} else {
  console.warn('Sentry is not properly configured. Errors won\'t be reported');
}

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
