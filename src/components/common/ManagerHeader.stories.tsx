import React from 'react';
import ManagerHeader, {ManagerHeaderProps} from './ManagerHeader';
import {Meta, Story} from '@storybook/react';

//MUI
import Stack from '@mui/material/Stack';

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
    color: {control: 'color'}
  }
} as Meta;

const Template: Story<ManagerHeaderProps> = args => <ManagerHeader {...args}/>;
const DeviceTemplate: Story<ManagerHeaderProps> = args =>
  <Stack sx={{
    height: '500px',
    width: DRAWER_WIDTH,
    boxShadow: 3,
    overflow: 'hidden',
    m: 0,
    p: 0
  }}>
    <ManagerHeader {...args}/>
  </Stack>;

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