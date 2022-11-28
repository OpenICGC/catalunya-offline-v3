
import React from 'react';
import {Meta, Story} from '@storybook/react';
import FeaturesPanel, {FeaturesPanelProps} from './FeaturesPanel';

import Box from '@mui/material/Box';
import {DRAWER_WIDTH} from '../../config';
import {v4 as uuidv4} from 'uuid';

export default {
  title: 'Scope/FeaturesPanel',
  color: { control: 'color' }
} as Meta;

const Template: Story<FeaturesPanelProps> = args => <FeaturesPanel {...args}/>;

const DeviceTemplate: Story<FeaturesPanelProps> = args => <Box
  sx={{width: DRAWER_WIDTH, height: 544, boxShadow: 3}}><FeaturesPanel {...args}/></Box>;

export const Default = Template.bind({});
Default.args = {
  name: 'Montseny',
  color: '#095c7a',
  pointItems: [
    {
      id: uuidv4(),
      name: 'Mi Punto 01',
      color: '#247a44',
      isActive: true
    },
    {
      id: uuidv4(),
      name: 'Mi Punto 02',
      color: '#fc5252',
      isActive: false
    },
    {
      id: uuidv4(),
      name: 'Mi Punto 03',
      color: '#f5017a',
      isActive: true
    },
    {
      id: uuidv4(),
      name: 'Mi Punto 01',
      color: '#247a44',
      isActive: true
    },
    {
      id: uuidv4(),
      name: 'Mi Punto 02',
      color: '#fc5252',
      isActive: false
    },
    {
      id: uuidv4(),
      name: 'Mi Punto 03',
      color: '#f5017a',
      isActive: true
    },
    {
      id: uuidv4(),
      name: 'Mi Punto 01',
      color: '#247a44',
      isActive: true
    },
    {
      id: uuidv4(),
      name: 'Mi Punto 02',
      color: '#fc5252',
      isActive: false
    },
    {
      id: uuidv4(),
      name: 'Mi Punto 03',
      color: '#f5017a',
      isActive: true
    },
    {
      id: uuidv4(),
      name: 'Mi Punto 01',
      color: '#247a44',
      isActive: true
    },
    {
      id: uuidv4(),
      name: 'Mi Punto 02',
      color: '#fc5252',
      isActive: false
    },
    {
      id: uuidv4(),
      name: 'Mi Punto 03',
      color: '#f5017a',
      isActive: true
    },
    {
      id: uuidv4(),
      name: 'Mi Punto 01',
      color: '#247a44',
      isActive: true
    },
    {
      id: uuidv4(),
      name: 'Mi Punto 02',
      color: '#fc5252',
      isActive: false
    },
    {
      id: uuidv4(),
      name: 'Mi Punto 03',
      color: '#f5017a',
      isActive: true
    }
  ],
  pathItems: [
    {
      id: uuidv4(),
      name: 'Mi Traza 01',
      color: '#247a44',
      isActive: true
    },
    {
      id: uuidv4(),
      name: 'Mi Traza 02',
      color: '#fc5252',
      isActive: false
    }
  ],
  isAccessibleSize: false,
  isLeftHanded: false
};

export const Device = DeviceTemplate.bind({});
Device.args = {
  ...Default.args
};

