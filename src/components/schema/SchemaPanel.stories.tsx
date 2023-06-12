import React from 'react';
import {Meta, Story} from '@storybook/react';

import SchemaPanel, {SchemaPanelProps} from './SchemaPanel';
import {v4 as uuidv4} from 'uuid';
import Stack from '@mui/material/Stack';
import {DRAWER_WIDTH} from '../../config';
import useColorRamp from '@geomatico/geocomponents/hooks/useColorRamp';


export default {
  title: 'Schema/SchemaPanel',
  component: SchemaPanel
} as Meta;

const stackSx = {
  height: '500px',
  width: DRAWER_WIDTH,
  boxShadow: 3,
  overflow: 'hidden',
  m: 0,
  p: 0
};

const Template: Story<SchemaPanelProps> = args => <SchemaPanel {...args}/>;
const DeviceTemplate: Story<SchemaPanelProps> = args => <Stack sx={stackSx}><SchemaPanel {...args}/></Stack>;
  
const palette = useColorRamp('BrewerDark27').hexColors;
  
export const Default = Template.bind({});
Default.args = {
  scopes: [
    {
      id: uuidv4(),
      name: 'Mi ámbito con esquema',
      color: palette[Math.floor(Math.random() * palette.length)], // Color asignado la mitad de las veces,
      schema: [...Array(5).keys()].map(i => ({
        id: uuidv4(),
        name: `Field ${i}`,
        appliesToPoints: Math.random() < 0.5,
        appliesToTracks: Math.random() < 0.5,
      }))
    },
    {
      id: uuidv4(),
      name: 'Mi ámbito sin esquema',
      color: palette[Math.floor(Math.random() * palette.length)], // Color asignado la mitad de las veces,
    }
  ],
  scope: {
    id: uuidv4(),
    name: 'Montseny',
    color: '#095c7a',
    schema: [
      {
        id: uuidv4(),
        name: 'Denominación',
        appliesToPoints: true,
        appliesToTracks: true
      },
      {
        id: uuidv4(),
        name: 'Siglo',
        appliesToPoints: true,
        appliesToTracks: false
      },
      {
        id: uuidv4(),
        name: 'Conservación',
        appliesToPoints: false,
        appliesToTracks: true
      },
      {
        id: uuidv4(),
        name: 'Conservación',
        appliesToPoints: false,
        appliesToTracks: true
      },
      {
        id: uuidv4(),
        name: 'Conservación',
        appliesToPoints: false,
        appliesToTracks: true
      }
    ]
  },
  
};

export const WithoutFields = DeviceTemplate.bind({});
WithoutFields.args = {
  scopes: [...Array(4).keys()].map(i => ({
    id: uuidv4(),
    name: `Mi ámbito ${i}`,
    color: palette[Math.floor(Math.random() * palette.length)], // Color asignado la mitad de las veces
    isVisible: Math.random() < 0.5,
    schema: [...Array(5).keys()].map(i => ({
      id: uuidv4(),
      name: `Field ${i}`,
      appliesToPoints: Math.random() < 0.5,
      appliesToTracks: Math.random() < 0.5,
    })).concat([])
  })),
  scope: {
    id: uuidv4(),
    name: 'Montseny',
    color: '#095c7a'
  }
};

export const Device = DeviceTemplate.bind({});
Device.args = {
  ...Default.args
};