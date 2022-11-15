import React from 'react';
import ManagerHeader from './ManagerHeader';

import FolderIcon from '@mui/icons-material/Folder';
import LayersIcon from '@mui/icons-material/Layers';
import MapIcon from '@mui/icons-material/Map';


export default {
  title: 'Scopes/ManagerHeader',
  component: ManagerHeader,
  argTypes: {
    color: { control: 'color' },
  },
};

const Template = args => <ManagerHeader {...args}/>;

export const Scopes = Template.bind({});
Scopes.args = {
  name: 'ÁMBITOS',
  startIcon: <FolderIcon fontSize='large' sx={{color: theme => theme.palette.getContrastText('#1b718c')}}/>,
  color: '#1b718c'
};

export const Layers = Template.bind({});
Layers.args = {
  name: 'CAPAS',
  startIcon: <LayersIcon fontSize='large' sx={{color: theme => theme.palette.getContrastText('#93f501')}}/>,
  color: '#93f501'
};

export const BaseMaps = Template.bind({});
BaseMaps.args = {
  name: 'MAPAS BASE',
  startIcon: <MapIcon fontSize='large' sx={{color: theme => theme.palette.getContrastText('#fc5252')}}/>,
  color: '#fc5252'
};