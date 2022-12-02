import React from 'react';
import {Meta, Story} from '@storybook/react';

import PointPanel, {PointPanelProps} from './PointPanel';

import {v4 as uuidv4} from 'uuid';
import {DRAWER_WIDTH} from '../../config';
import Stack from '@mui/material/Stack';

export default {
  title: 'Scope/PointPanel',
  component: PointPanel
} as Meta;

const Template: Story<PointPanelProps> = args => <PointPanel {...args}/>;
const DeviceTemplate: Story<PointPanelProps> = args => <Stack sx={{
  height: '800px',
  width: DRAWER_WIDTH,
  boxShadow: 3,
  overflow: 'hidden',
  m: 0,
  p: 0
}}>
  <PointPanel {...args}/>
</Stack>;
    
export const Default = Template.bind({});
Default.args = {
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
      coordinates: [40.4125, -3.6897, 1225]
    },
    properties: {
      name: 'Can Net',
      color: '#197983',
      timestamp: Date.now(),
      description: 'Había un árbol con el tronco torcido en medio del camino.',
      images: [],
      isVisible: true
    }
  },
  numPoints: 13,
  numPaths: 5,
  images: [...Array(3).keys()].map(i => ({
    id: uuidv4(),
    url: 'https://picsum.photos/300/200',
    name: `Imagen ${i}`,
    contentType: 'image/jpg',
    isLoading: Math.random() < 0.1,
  }))
};

export const Device = DeviceTemplate.bind({});
Device.args = {
  ...Default.args
};