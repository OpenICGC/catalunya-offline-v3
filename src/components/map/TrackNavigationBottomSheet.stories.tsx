import React, {useState} from 'react';
import {Meta, Story} from '@storybook/react';

import TrackNavigationBottomSheet, {TrackNavigationBottomSheetProps} from './TrackNavigationBottomSheet';
import sample from '../fixtures/sampleLineString.geo.json';
import sampleWithoutHeight from '../fixtures/sampleLineStringWithoutHeight.geo.json';
const sampleGeometry: GeoJSON.LineString = sample as GeoJSON.LineString;
const sampleGeometryWithoutHeight: GeoJSON.LineString = sampleWithoutHeight as GeoJSON.LineString;
import {v4 as uuid} from 'uuid';
import {BASEMAPS, INITIAL_VIEWPORT} from '../../config';
import Box from '@mui/material/Box';
import GeocomponentMap from '@geomatico/geocomponents/Map/Map';

export default {
  title: 'Map/TrackNavigationBottomSheet',
  component: TrackNavigationBottomSheet,
  argTypes: {
    currentPositionIndex: {
      control: {
        type: 'range',
        min: 0,
        max: sampleGeometry && sampleGeometry.coordinates.length - 1,
        step: 1
      }
    }
  }
} as Meta;

const Template: Story<TrackNavigationBottomSheetProps> = args => <TrackNavigationBottomSheet {...args}/>;

const WithMapTemplate: Story<TrackNavigationBottomSheetProps> = ({...args}) => {
  const [getViewport, setViewport] = useState(INITIAL_VIEWPORT);
  return <Box sx={{ width: '100vw', height: '100vh', position: 'relative', boxShadow: 1 }}>
    <GeocomponentMap mapStyle={BASEMAPS[1].onlineStyle} onViewportChange={setViewport} viewport={getViewport}/>
    <TrackNavigationBottomSheet {...args}/>
  </Box>;
};

export const Default = Template.bind({});
Default.args = {
  track: {
    type: 'Feature',
    id: uuid(),
    properties: {
      name: 'Mi traza 01',
      timestamp: Date.now(),
      description: 'Excursión con amigos de la infancia',
      images: [...Array(3).keys()].map(i => `https://picsum.photos/300/20${i}`),
      color: '#973572',
      isVisible: true
    },
    geometry: sampleGeometry
  },
  currentPositionIndex: 24,
  isOutOfTrack: false,
  isReverseDirection: false
};

export const WithoutHeight = Template.bind({});
WithoutHeight.args = {
  ...Default.args,
  track: {
    type: 'Feature',
    id: uuid(),
    properties: {
      name: 'Mi traza 01',
      timestamp: Date.now(),
      description: 'Excursión con amigos de la infancia',
      images: [...Array(3).keys()].map(i => `https://picsum.photos/300/20${i}`),
      color: '#973572',
      isVisible: true
    },
    geometry: sampleGeometryWithoutHeight
  },
};

export const WithMap = WithMapTemplate.bind({});
WithMap.args = {
  ...Default.args
};
