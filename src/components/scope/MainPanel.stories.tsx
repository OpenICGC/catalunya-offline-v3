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
  items: [...Array(20).keys()].map(i => ({
    id: uuidv4(),
    name: `Mi ámbito ${i}`,
    color: '#fabada',
    isActive: true,
  })),
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
