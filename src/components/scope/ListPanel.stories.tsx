import React from 'react';
import ListPanel, {ListPanelProps} from './ListPanel';
import {Meta, Story} from '@storybook/react';

//MUI
import Box from '@mui/material/Box';

//UTILS
import {v4 as uuidv4} from 'uuid';
import {DRAWER_WIDTH} from '../../config';

export default {
  title: 'Scope/ListPanel',
  component: ListPanel
} as Meta;

const Template: Story<ListPanelProps> = args => <ListPanel {...args}/>;
const DeviceTemplate: Story<ListPanelProps> = args => <Box
  sx={{width: DRAWER_WIDTH, height: 844, boxShadow: 3}}><ListPanel {...args}/></Box>;

export const Default = Template.bind({});
Default.args = {
  entities: [
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
  entities: []

};

export const Device = DeviceTemplate.bind({});
Device.args = {
  ...Default.args
};