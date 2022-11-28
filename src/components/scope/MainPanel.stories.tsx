import React from 'react';
import MainPanel, {MainPanelProps} from './MainPanel';
import {Meta, Story} from '@storybook/react';

//MUI
import Box from '@mui/material/Box';

//UTILS
import {v4 as uuidv4} from 'uuid';
import {DRAWER_WIDTH} from '../../config';

export default {
  title: 'Scope/MainPanel',
  component: MainPanel
} as Meta;

const Template: Story<MainPanelProps> = args => <MainPanel {...args}/>;
const DeviceTemplate: Story<MainPanelProps> = args => <Box
  sx={{width: DRAWER_WIDTH, height: 844, boxShadow: 3}}><MainPanel {...args}/></Box>;

export const Default = Template.bind({});
Default.args = {
  items: [
    {
      id: uuidv4(),
      name: 'Mi ámbito 01',
      color: '#247a44',
      isActive: true
    },
    {
      id: uuidv4(),
      name: 'Mi ámbito 02',
      color: '#fc5252',
      isActive: true
    },
    {
      id: uuidv4(),
      name: 'Mi ámbito 03',
      color: '#f5017a',
      isActive: true
    },
  ],
  isAccessibleSize: false,
  isLeftHanded: false,
};

export const Empty = DeviceTemplate.bind({});
Empty.args = {
  ...Default.args,
  items: []

};

export const Device = DeviceTemplate.bind({});
Device.args = {
  ...Default.args
};