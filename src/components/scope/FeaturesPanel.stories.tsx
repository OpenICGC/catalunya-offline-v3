import React from 'react';
import {Meta, Story} from '@storybook/react';
import FeaturesPanel, {FeaturesPanelProps} from './FeaturesPanel';

import {DRAWER_WIDTH} from '../../config';
import {v4 as uuidv4} from 'uuid';

import useColorRamp from '@geomatico/geocomponents/hooks/useColorRamp';
import Stack from '@mui/material/Stack';

export default {
  title: 'Scope/FeaturesPanel',
  component: FeaturesPanel
} as Meta;

const Template: Story<FeaturesPanelProps> = args => <FeaturesPanel {...args}/>;

const DeviceTemplate: Story<FeaturesPanelProps> = args => <Stack sx={{
  height: '500px',
  width: DRAWER_WIDTH,
  boxShadow: 3,
  overflow: 'hidden',
  m: 0,
  p: 0
}}>
  <FeaturesPanel {...args}/>
</Stack>;

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
  scopeTracks: [...Array(20).keys()].map(i => ({
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
