import React, {useState} from 'react';
import {Meta, Story} from '@storybook/react';

import {Position} from 'geojson';
import TrackNavigationBottomSheet, {TrackNavigationBottomSheetProps} from './TrackNavigationBottomSheet';
import sample from '../fixtures/sampleLineString.geo.json';
import sampleWithoutHeight from '../fixtures/sampleLineStringWithoutHeight.geo.json';
const sampleCoordinates: Position[] = sample.coordinates as Position[];
const sampleCoordinatesWithoutHeight: Position[] = sampleWithoutHeight.coordinates as Position[];
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
        max: sampleCoordinates && sampleCoordinates.length - 1,
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
  name: 'Mi traza 01',
  color: '#973572',
  coordinates: sampleCoordinates,
  currentPositionIndex: 24,
  isOutOfTrack: false,
  isReverseDirection: false
};

export const WithoutHeight = Template.bind({});
WithoutHeight.args = {
  ...Default.args,
  name: 'Mi traza 01',
  color: '#973572',
  coordinates: sampleCoordinatesWithoutHeight
};

export const WithMap = WithMapTemplate.bind({});
WithMap.args = {
  ...Default.args
};
