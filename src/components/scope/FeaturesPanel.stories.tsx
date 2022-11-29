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
    
/*const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;*/
    
export const Default = Template.bind({});
Default.args = {
  scope: {
    id: uuidv4(),
    name: 'Montseny',
    color: '#095c7a'
  },
  pointItems: [...Array(15).keys()].map(i => ({
    id: uuidv4(),
    name: `Mi punto ${i}`,
    color: '#fabada', //randomColor
    isActive: Math.random() < 0.5,
  })),
  pathItems: [...Array(5).keys()].map(i => ({
    id: uuidv4(),
    name: `Mi traza ${i}`,
    color: '#fabada',
  })),
  isAccessibleSize: false,
  isLeftHanded: false
};

export const Device = DeviceTemplate.bind({});
Device.args = {
  ...Default.args
};

