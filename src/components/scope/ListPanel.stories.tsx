import React from 'react';
import ListPanel, {ListPanelProps} from './ListPanel';
import {Meta, Story} from '@storybook/react';

import Box from '@mui/material/Box';
import {DRAWER_WIDTH} from '../../config';

export default {
  title: 'Scope/ListPanel',
  component: ListPanel,
  argTypes: {
    color: { control: 'color' },
  },
} as Meta;

const Template: Story<ListPanelProps> = args => <ListPanel {...args}/>;
const DeviceTemplate: Story<ManagerHeaderProps> = args => <Box sx={{width: DRAWER_WIDTH, height: 844, boxShadow: 3}}><ListPanel {...args}/></Box>;

export const Default = Template.bind({});
Default.args = {
  scopes: [
    {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Ámbito 01',
      color: '#27AE60',
    },
    {
      id: '123e4567-e89b-12d3-a456-426614174200',
      name: 'Ámbito 02',
      color: '#CB4335',
    },
    {
      id: '123e4567-e89b-1223-a456-426614174000',
      name: 'Ámbito 03',
      color: '#A2D9CE',
    },
    {
      id: '123e4567-e89b-22d3-a456-426614174000',
      name: 'Ámbito 04',
      color: '#85929E',
    },
    {
      id: '223e4567-e89b-12d3-a456-426614174000',
      name: 'Ámbito 05',
      color: '#F7DC6F',
    }
  ]
};

export const Device = DeviceTemplate.bind({});
Device.args = {
  ...Default.args
};