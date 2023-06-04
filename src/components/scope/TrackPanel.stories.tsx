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
const sampleGeometry: GeoJSON.LineString = sample as GeoJSON.LineString;
const sampleGeometryWithoutHeight: GeoJSON.LineString = sampleWithoutHeight as GeoJSON.LineString;
const sampleGeometryWithZeroHeight: GeoJSON.LineString = sampleWithZeroHeight as GeoJSON.LineString;
const sampleGeomatryWithoutTimestamp: GeoJSON.LineString = sampleWithoutTimestamp as GeoJSON.LineString;

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
    geometry: sampleGeometry
  },
  numPoints: 13,
  numTracks: 5
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
    geometry: sampleGeomatryWithoutTimestamp
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
