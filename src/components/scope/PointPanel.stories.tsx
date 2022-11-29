import React from 'react';
import {Meta, Story} from '@storybook/react';

import PointPanel, {PointPanelProps} from './PointPanel';

import {v4 as uuidv4} from 'uuid';
import Box from '@mui/material/Box';
import {DRAWER_WIDTH} from '../../config';

export default {
  title: 'Scope/PointPanel',
  component: PointPanel
} as Meta;

const Template: Story<PointPanelProps> = args => <PointPanel {...args}/>;
const DeviceTemplate: Story<PointPanelProps> = args => <Box
  sx={{width: DRAWER_WIDTH, height: 844, boxShadow: 3}}><PointPanel {...args}/></Box>;

export const Default = Template.bind({});
Default.args = {
  isEditing: false,
  scope: {
    id: uuidv4(),
    name: 'Montseny',
    color: '#095c7a',
  },
  point: {
    type: 'Feature',
    id: uuidv4(),
    geometry: {
      type: 'Point',
      coordinates: [40.4024, -3.6984, 1250]
    },
    properties: {
      name: 'Montseny',
      color: '#fabada',
      timestamp: Date.now(),
      description: 'Había un árbol con el tronco torcido en medio del camino.',
      images: [],
      isVisible: true
    }
  },
  numPoints: 13,
  numPaths: 5,
};

export const Device = DeviceTemplate.bind({});
Device.args = {
  ...Default.args
};