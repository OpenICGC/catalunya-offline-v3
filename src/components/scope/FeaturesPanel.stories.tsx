import React from 'react';
import {Meta, Story} from '@storybook/react';
import FeaturesPanel, {FeaturesPanelProps} from './FeaturesPanel';

import Box from '@mui/material/Box';
import {DRAWER_WIDTH} from '../../config';
import {v4 as uuidv4} from 'uuid';

import useColorRamp from '@geomatico/geocomponents/hooks/useColorRamp';

export default {
  title: 'Scope/FeaturesPanel',
  component: FeaturesPanel
} as Meta;

const Template: Story<FeaturesPanelProps> = args => <FeaturesPanel {...args}/>;

const DeviceTemplate: Story<FeaturesPanelProps> = args => <Box
  sx={{width: DRAWER_WIDTH, height: 544, boxShadow: 3}}><FeaturesPanel {...args}/></Box>;

const palette = useColorRamp('BrewerOranges4').hexColors;

export const Default = Template.bind({});
Default.args = {
  scope: {
    id: uuidv4(),
    name: 'Montseny',
    color: '#095c7a'
  },
  scopePoints: [...Array(15).keys()].map(i => ({
    type: 'Feature',
    id: uuidv4(),
    geometry: {
      type: 'Point',
      coordinates: [0, 0]
    },
    properties: {
      name: `Mi punto ${i}`,
      timestamp: Date.now(),
      description: '',
      images: [],
      color: Math.random() < 0.5 ? palette[i % palette.length] : undefined, // Color asignado la mitad de las veces
      isVisible: Math.random() < 0.5
    }
  })),
  scopePaths: [...Array(20).keys()].map(i => ({
    type: 'Feature',
    id: uuidv4(),
    geometry: {
      type: 'LineString',
      coordinates: [[0, 0], [1, 1]]
    },
    properties: {
      name: `Mi traza ${i}`,
      timestamp: Date.now(),
      description: '',
      images: [],
      color: Math.random() < 0.5 ? palette[i % palette.length] : undefined, // Color asignado la mitad de las veces
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
