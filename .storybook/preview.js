import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';

import ThemeProvider from '@mui/material/styles/ThemeProvider';
import {ThemeProvider as Emotion10ThemeProvider} from 'emotion-theming';

import '../src/i18n';

import theme from '../src/theme';

export const parameters = {
  actions: {argTypesRegex: "^on[A-Z].*"},
  backgrounds: {disable: true},
  layout: 'fullscreen',
  options: {
    storySort: (a, b) =>
      a[1].kind === b[1].kind ? 0 : a[1].id.localeCompare(b[1].id, undefined, { numeric: true }),
  },
}

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Material-ui theme',
    defaultValue: 'light',
    toolbar: {
      icon: 'circle', // Available icons: https://www.chromatic.com/component?appId=5a375b97f4b14f0020b0cda3&name=Basics%7CIcon&buildNumber=13899
      items: [
        {value: 'light', left: '⚪', title: 'Light'},
        {value: 'dark', left: '⚫', title: 'Dark'}
      ],
    },
  },
};

const withThemeProvider = (Story, context) =>
  <Emotion10ThemeProvider theme={theme(context.globals.theme)}>
    <ThemeProvider theme={theme(context.globals.theme)}>
      <CssBaseline/>
      <Story {...context} />
    </ThemeProvider>
  </Emotion10ThemeProvider>;

export const decorators = [
  withThemeProvider,
];
