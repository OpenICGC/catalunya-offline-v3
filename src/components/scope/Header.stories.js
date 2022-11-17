import React from 'react';
import Header from './Header';

import Box from '@mui/material/Box';
import {DRAWER_WIDTH} from '../../config';

export default {
  title: 'Scope/Header',
  component: Header,
  argTypes: {
    color: { control: 'color' },
  },
};

/*const Template = args => <Header {...args}/>;*/
const DeviceTemplate = args => <Box sx={{width: DRAWER_WIDTH, height: 844, boxShadow: 3}}><Header {...args}/></Box>;

export const Default = DeviceTemplate.bind({});
Default.args = {
  name: 'Montseny',
  color: '#ccf598',
  numPoints: 15,
  numPaths: 7
};

export const Long = DeviceTemplate.bind({});
Long.args = {
  name: 'Artesa de Segre con amigos',
  color: '#ccf598',
  numPoints: 15,
  numPaths: 7
};