import React from 'react';
import ManagerHeader from './ManagerHeader';

import Box from '@mui/material/Box';
import FolderIcon from '@mui/icons-material/Folder';
import LayersIcon from '@mui/icons-material/Layers';
import MapIcon from '@mui/icons-material/Map';
import {DRAWER_WIDTH} from '../config';

export default {
  title: 'Scopes/ManagerHeader',
  component: ManagerHeader,
  argTypes: {
    color: { control: 'color' },
  },
};

const Template = args => <ManagerHeader {...args}/>;
const DeviceTemplate = args => <Box sx={{width: DRAWER_WIDTH, height: 844, boxShadow: 3}}><ManagerHeader {...args}/></Box>;

export const Scopes = Template.bind({});
Scopes.args = {
  name: 'Ámbitos',
  startIcon: <FolderIcon sx={{color: theme => theme.palette.getContrastText('#1b718c')}}/>,
  color: '#1b718c'
};

export const Layers = Template.bind({});
Layers.args = {
  name: 'Capas',
  startIcon: <LayersIcon sx={{color: theme => theme.palette.getContrastText('#93f501')}}/>,
  color: '#93f501'
};

export const BaseMaps = Template.bind({});
BaseMaps.args = {
  name: 'Mapas Base',
  startIcon: <MapIcon sx={{color: theme => theme.palette.getContrastText('#fc5252')}}/>,
  color: '#fc5252'
};

export const Device = DeviceTemplate.bind({});
Device.args = {
  name: 'Mapas Base',
  startIcon: <MapIcon sx={{color: theme => theme.palette.getContrastText('#fc5252')}}/>,
  color: '#fc5252'
};