import React from 'react';
import {Meta, Story} from '@storybook/react';
import FeaturesPanel, {FeaturesPanelProps} from './FeaturesPanel';

import Box from '@mui/material/Box';
import {DRAWER_WIDTH} from '../../config';
import {v4 as uuidv4} from 'uuid';

export default {
  title: 'Scope/FeaturesPanel',
  color: {control: 'color'}
} as Meta;

const Template: Story<FeaturesPanelProps> = args => <FeaturesPanel {...args}/>;

const DeviceTemplate: Story<FeaturesPanelProps> = args => <Box
  sx={{width: DRAWER_WIDTH, height: 544, boxShadow: 3}}><FeaturesPanel {...args}/></Box>;

export const Default = Template.bind({});
Default.args = {
  scope: {
    id: uuidv4(),
    name: 'Montseny',
    color: '#095c7a'
  },
  pointItems: [...Array(15)].map(i => ({
    type: 'Feature',
    id: uuidv4(),
    geometry: {
      type: 'Point',
      coordinates: [Math.random()*10, Math.random()*10, Math.random()*10]
    },
    properties: {
      name: `Mi punto ${i}`,
      color: '#fabada',
      timestamp: Date.now(),
      description: '',
      images: [],
      isVisible: Math.random() < 0.5
    }
  })),
  pathItems: [...Array(5)].map(i => ({
    type: 'Feature',
    id: uuidv4(),
    geometry: {
      type: 'LineString',
      coordinates: [[Math.random()*40, Math.random()*10], [Math.random()*40, Math.random()*10]]
    },
    properties: {
      name: `Mi traza ${i}`,
      color: '#fabada',
      timestamp: Date.now(),
      description: '',
      images: [],
      isVisible: Math.random() < 0.5
    }
  })),
  isAccessibleSize: false,
  isLeftHanded: false
};

export const Device = DeviceTemplate.bind({});
Device.args = {
  ...Default.args
};

