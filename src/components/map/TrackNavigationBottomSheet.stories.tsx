import React, {useState} from 'react';
import {Meta, Story} from '@storybook/react';

import {Position} from 'geojson';
import TrackNavigationBottomSheet, {TrackNavigationBottomSheetProps} from './TrackNavigationBottomSheet';
import sample from '../scope/fixtures/sampleLineString.geojson';
import sampleWithoutHeight from '../scope/fixtures/sampleLineStringWithoutHeight.geojson';
const sampleCoordinates: Position[] = JSON.parse(sample).coordinates as Position[];
const sampleCoordinatesWithoutHeight: Position[] = JSON.parse(sampleWithoutHeight).coordinates as Position[];
import {BASEMAPS, DEFAULT_VIEWPORT} from '../../config';
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
  const [getViewport, setViewport] = useState(DEFAULT_VIEWPORT);
  return <Box sx={{ width: '100vw', height: '100vh', position: 'relative', boxShadow: 1 }}>
    <GeocomponentMap mapStyle={BASEMAPS[1].style} onViewportChange={setViewport} viewport={getViewport}/>
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
