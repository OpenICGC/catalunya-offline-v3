import React from 'react';
import ManagerHeader, {ManagerHeaderProps} from './ManagerHeader';
import {Meta, Story} from '@storybook/react';

//MUI
import Box from '@mui/material/Box';

//MUI-ICONS
import FolderIcon from '@mui/icons-material/Folder';
import LayersIcon from '@mui/icons-material/Layers';
import MapIcon from '@mui/icons-material/Map';

//UTILS
import {DRAWER_WIDTH} from '../../config';

export default {
  title: 'Common/ManagerHeader',
  component: ManagerHeader,
  argTypes: {
    color: { control: 'color' },
  },
} as Meta;

const Template: Story<ManagerHeaderProps> = args => <ManagerHeader {...args}/>;
const DeviceTemplate: Story<ManagerHeaderProps> = args => <Box sx={{width: DRAWER_WIDTH, height: 844, boxShadow: 3}}><ManagerHeader {...args}/></Box>;

export const Scopes = Template.bind({});
Scopes.args = {
  name: 'Ámbitos',
  startIcon: <FolderIcon/>,
  color: '#1b718c'
};

export const Layers = Template.bind({});
Layers.args = {
  name: 'Capas',
  startIcon: <LayersIcon/>,
  color: '#93f501'
};

export const BaseMaps = Template.bind({});
BaseMaps.args = {
  name: 'Mapas Base',
  startIcon: <MapIcon/>,
  color: '#fc5252'
};

export const Device = DeviceTemplate.bind({});
Device.args = {
  name: 'Mapas Base',
  startIcon: <MapIcon/>,
  color: '#fc5252'
};