import React from 'react';
import {Meta, Story} from '@storybook/react';

import UserLayerPanel, {UserLayerPanelProps} from './UserLayerPanel';
import {v4 as uuidv4} from 'uuid';
import Stack from '@mui/material/Stack';
import {DRAWER_WIDTH} from '../../config';

export default {
  title: 'Common/UserLayerPanel',
  component: UserLayerPanel
} as Meta;

const Template: Story<UserLayerPanelProps> = args => <UserLayerPanel {...args}/>;
const DeviceTemplate: Story<UserLayerPanelProps> = args => <Stack sx={{
  height: '800px',
  width: DRAWER_WIDTH,
  boxShadow: 3,
  overflow: 'hidden',
  m: 0,
  p: 0
}}>
  <UserLayerPanel {...args}/>;
</Stack>;
const SmallDeviceTemplate: Story<UserLayerPanelProps> = args => <Stack sx={{
  height: '500px',
  width: DRAWER_WIDTH,
  boxShadow: 3,
  overflow: 'hidden',
  m: 0,
  p: 0
}}>
  <UserLayerPanel {...args}/>;
</Stack>;

export const Default = Template.bind({});
Default.args = {
  userLayers: [
    {
      id: uuidv4(),
      name: 'Patrimonio',
      color: '#973572',
      isVisible: true,
      data: {
        type: 'FeatureCollection',
        features: [
          {
            'type': 'Feature',
            'id': '55610ca2-9e2a-41bf-a6fa-c603181f9c4a',
            'properties': {
              'name': 'Point 1',
              'color': '#973572',
              'timestamp': 1673876171254,
              'description': 'Point 1 description',
              'images': [],
              'isVisible': true
            },
            'geometry': {
              'type': 'Point',
              'coordinates': [0, 0]
            }
          }
        ]
      }
    },
    {
      id: uuidv4(),
      name: 'Árboles',
      color: '#fabada',
      isVisible: true,
      data: {
        type: 'FeatureCollection',
        features: [
          {
            'type': 'Feature',
            'id': '55610ca2-9e2a-41bf-a6fa-c603181f9c4a',
            'properties': {
              'name': 'Point 1',
              'color': '#973572',
              'timestamp': 1673876171254,
              'description': 'Point 1 description',
              'images': [],
              'isVisible': true
            },
            'geometry': {
              'type': 'Point',
              'coordinates': [0, 0]
            }
          }
        ]
      }
    }
  ]
};

export const Device = DeviceTemplate.bind({});
Device.args = {
  ...Default.args
};

export const SmallDevice = SmallDeviceTemplate.bind({});
SmallDevice.args = {
  ...Default.args
};