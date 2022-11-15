import React from 'react';
import ManagerHeader from './ManagerHeader';

import FolderIcon from '@mui/icons-material/Folder';
import LayersIcon from '@mui/icons-material/Layers';
import MapIcon from '@mui/icons-material/Map';


export default {
  title: 'Scopes/ManagerHeader',
  component: ManagerHeader
};

const Template = args => <ManagerHeader {...args}/>;

export const Scopes = Template.bind({});
Scopes.args = {
  name: 'ÁMBITOS',
  startIcon: <FolderIcon fontSize='large' sx={{color: 'text.secondary'}}/>,
  color: '#1b718c'
};

export const Layers = Template.bind({});
Layers.args = {
  name: 'CAPAS',
  startIcon: <LayersIcon fontSize='large' sx={{color: 'text.secondary'}}/>,
};

export const BaseMaps = Template.bind({});
BaseMaps.args = {
  name: 'MAPAS BASE',
  startIcon: <MapIcon fontSize='large' sx={{color: 'text.secondary'}}/>,
};