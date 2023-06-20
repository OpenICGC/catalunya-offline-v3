import React from 'react';
import {Meta, Story} from '@storybook/react';

import TrackPanel, {TrackPanelProps} from './TrackPanel';
import {v4 as uuidv4, v4 as uuid} from 'uuid';
import Stack from '@mui/material/Stack';
import {DRAWER_WIDTH} from '../../config';

import GeoJSON from 'geojson';
import sample from './fixtures/sampleLineString.geojson';
import sampleWithoutHeight from './fixtures/sampleLineStringWithoutHeight.geojson';
import sampleWithZeroHeight from './fixtures/sampleLineStringWithZeroHeight.geojson';
import sampleWithoutTimestamp from './fixtures/sampleLineStringWithoutTimestamp.geojson';
const sampleGeometry: GeoJSON.LineString = JSON.parse(sample);
const sampleGeometryWithoutHeight: GeoJSON.LineString = JSON.parse(sampleWithoutHeight);
const sampleGeometryWithZeroHeight: GeoJSON.LineString = JSON.parse(sampleWithZeroHeight);
const sampleGeometryWithoutTimestamp: GeoJSON.LineString = JSON.parse(sampleWithoutTimestamp);

export default {
  title: 'Scope/TrackPanel',
  component: TrackPanel
} as Meta;

const Template: Story<TrackPanelProps> = args => <TrackPanel {...args}/>;
const DeviceTemplate: Story<TrackPanelProps> = args => <Stack sx={{
  height: '800px',
  width: DRAWER_WIDTH,
  boxShadow: 3,
  overflow: 'hidden',
  m: 0,
  p: 0
}}>
  <TrackPanel {...args}/>
</Stack>;
const SmallDeviceTemplate: Story<TrackPanelProps> = args => <Stack sx={{
  height: '500px',
  width: DRAWER_WIDTH,
  boxShadow: 3,
  overflow: 'hidden',
  m: 0,
  p: 0
}}>
  <TrackPanel {...args}/>
</Stack>;

export const Default = Template.bind({});
Default.args = {
  scope: {
    id: uuidv4(),
    name: 'Montseny',
    color: '#095c7a',
    schema: [
      {
        id: '380148a0-d32e-4822-bac6-3875f664f8c5',
        name: 'Conservación',
        appliesToPoints: true,
        appliesToTracks: true,
      },
      {
        id: '523148a1-e45f-7676-bac8-1234f789f9c9',
        name: 'Altura de árbol',
        appliesToPoints: true,
        appliesToTracks: false,
      },
      {
        id: 'ad7074f8-7238-45f1-96ab-73e1f376a0b2',
        name: 'Circular',
        appliesToPoints: false,
        appliesToTracks: true,
      }
    ]
  },
  track: {
    type: 'Feature',
    id: uuid(),
    properties: {
      name: 'Mi traza 15',
      timestamp: Date.now(),
      description: 'Excursión con amigos de la infancia',
      images: [...Array(3).keys()].map(i => `https://picsum.photos/300/20${i}`),
      color: '#973572',
      isVisible: true
    },
    schemaValues: {
      '380148a0-d32e-4822-bac6-3875f664f8c5': 'Valor Conservación',
      'ad7074f8-7238-45f1-96ab-73e1f376a0b2': 'Valor Circular',
    },
    geometry: sampleGeometry
  },
  numPoints: 13,
  numTracks: 5,
  isEditing: false,
  isActive: false
};

export const Device = DeviceTemplate.bind({});
Device.args = {
  ...Default.args
};

export const SmallDevice = SmallDeviceTemplate.bind({});
SmallDevice.args = {
  ...Default.args
};

export const DeviceWithoutTimestamp = DeviceTemplate.bind({});
DeviceWithoutTimestamp.args = {
  ...Default.args,
  track: {
    type: 'Feature',
    id: uuid(),
    properties: {
      name: 'Mi traza 15',
      timestamp: Date.now(),
      description: 'Excursión con amigos de la infancia',
      images: [...Array(3).keys()].map(i => `https://picsum.photos/300/20${i}`),
      color: '#973572',
      isVisible: true
    },
    geometry: sampleGeometryWithoutTimestamp
  }
};

export const DeviceWithoutHeight = DeviceTemplate.bind({});
DeviceWithoutHeight.args = {
  ...Default.args,
  track: {
    type: 'Feature',
    id: uuid(),
    properties: {
      name: 'Mi traza 15',
      timestamp: Date.now(),
      description: 'Excursión con amigos de la infancia',
      images: [...Array(3).keys()].map(i => `https://picsum.photos/300/20${i}`),
      color: '#973572',
      isVisible: true
    },
    geometry: sampleGeometryWithoutHeight
  },
};

export const DeviceWithoutZeroHeight = DeviceTemplate.bind({});
DeviceWithoutZeroHeight.args = {
  ...Default.args,
  track: {
    type: 'Feature',
    id: uuid(),
    properties: {
      name: 'Mi traza 15',
      timestamp: Date.now(),
      description: 'Excursión con amigos de la infancia',
      images: [...Array(3).keys()].map(i => `https://picsum.photos/300/20${i}`),
      color: '#973572',
      isVisible: true
    },
    geometry: sampleGeometryWithZeroHeight
  },
};

export const DeviceWithoutGeom = DeviceTemplate.bind({});
DeviceWithoutGeom.args = {
  ...Default.args,
  track: {
    type: 'Feature',
    id: uuid(),
    properties: {
      name: 'Mi traza 15',
      timestamp: Date.now(),
      description: 'Excursión con amigos de la infancia',
      images: [...Array(3).keys()].map(i => `https://picsum.photos/300/20${i}`),
      color: '#973572',
      isVisible: true
    },
    geometry: null
  },
};
