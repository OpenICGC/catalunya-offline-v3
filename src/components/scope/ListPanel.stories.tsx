import React from 'react';
import ListPanel, {ListPanelProps} from './ListPanel';
import {Meta, Story} from '@storybook/react';

import Box from '@mui/material/Box';
import {DRAWER_WIDTH} from '../../config';
import {v4 as uuidv4} from 'uuid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DashboardIcon from '@mui/icons-material/Dashboard';

export default {
  title: 'Scope/ListPanel',
  component: ListPanel
} as Meta;

const Template: Story<ListPanelProps> = args => <ListPanel {...args}/>;
const DeviceTemplate: Story<ListPanelProps> = args => <Box
  sx={{width: DRAWER_WIDTH, height: 844, boxShadow: 3}}><ListPanel {...args}/></Box>;

export const Default = Template.bind({});
Default.args = {
  scopes: [
    {
      id: uuidv4(),
      name: 'Mi Punto o Traza',
      color: '#247a44',
    },
    {
      id: uuidv4(),
      name: 'Mi Punto o Traza',
      color: '#fc5252',
    },
    {
      id: uuidv4(),
      name: 'Mi Punto o Traza',
      color: '#f5017a',
    },
  ],
  contextualMenu: [
    {
      id: 'rename',
      label: 'Renombrar',
      icon: <EditIcon/>
    },
    {
      id: 'delete',
      label: 'Borrar',
      icon: <DeleteIcon/>
    },
    {
      id: 'instamaps',
      label: 'Instamaps',
      icon: <MoreHorizIcon/>
    },
    {
      id: 'dataSchema',
      label: 'Esquema de datos',
      icon: <DashboardIcon/>
    }
  ]
};

export const Device = DeviceTemplate.bind({});
Device.args = {
  ...Default.args
};