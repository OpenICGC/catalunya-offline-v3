import React from 'react';
import Header, {HeaderProps} from './Header';

import {DRAWER_WIDTH} from '../../config';
import {Meta, Story} from '@storybook/react';
import Stack from '@mui/material/Stack';

export default {
  title: 'Scope/Header',
  component: Header,
  argTypes: {
    color: {control: 'color'}
  }
} as Meta;

/*const Template = args => <Header {...args}/>;*/
const DeviceTemplate: Story<HeaderProps> = args => <Stack sx={{
  height: '500px',
  width: DRAWER_WIDTH,
  boxShadow: 3,
  overflow: 'hidden',
  m: 0,
  p: 0
}}><Header {...args}/></Stack>;

export const Default = DeviceTemplate.bind({});
Default.args = {
  name: 'Montseny',
  color: '#ccf598',
  numPoints: 15,
  numTracks: 7
};

export const Long = DeviceTemplate.bind({});
Long.args = {
  name: 'Artesa de Segre con amigos',
  color: '#ccf598',
  numPoints: 15,
  numTracks: 7
};