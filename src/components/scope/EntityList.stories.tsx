import React from 'react';
import EntityList, {ListPanelProps} from './EntityList';
import {Meta, Story} from '@storybook/react';

import Box from '@mui/material/Box';
import {DRAWER_WIDTH} from '../../config';
import {v4 as uuidv4} from 'uuid';
import EditIcon from '@mui/icons-material/Edit';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ManagerHeader from '../ManagerHeader';

export default {
  title: 'Scope/EntityList',
  component: EntityList
} as Meta;

const Template: Story<ListPanelProps> = args => <EntityList {...args}/>;
const DeviceTemplate: Story<ListPanelProps> = args => <Box
  sx={{width: DRAWER_WIDTH, height: 844, boxShadow: 3}}><EntityList {...args}/></Box>;
    
const DeviceEntityTemplate: Story<ListPanelProps> = args => <Box
  sx={{width: DRAWER_WIDTH, height: 844, boxShadow: 3}}>
  <ManagerHeader name='Ámbitos' color='#1b718c' startIcon={<FolderIcon sx={{color: theme => theme.palette.getContrastText('#fc5252')}}/>}/>
  <EntityList {...args}/>
</Box>;

export const Default = Template.bind({});
Default.args = {
  scopes: [
    {
      id: uuidv4(),
      name: 'Mi Punto',
      color: '#247a44',
    },
    {
      id: uuidv4(),
      name: 'Mi Traza',
      color: '#fc5252',
    },
    {
      id: uuidv4(),
      name: 'Mi Ámbito',
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

export const EntityDevice = DeviceEntityTemplate.bind({});
EntityDevice.args = {
  ...Default.args
};