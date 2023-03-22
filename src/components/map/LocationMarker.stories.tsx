import React, {useState} from 'react';
import {Meta, Story} from '@storybook/react';

import LocationMarker, {LocationMarkerProps} from './LocationMarker';
import {DEFAULT_VIEWPORT, BASEMAPS} from '../../config';
import Box from '@mui/material/Box';
import Map from '@geomatico/geocomponents/Map/Map';

export default {
  title: 'Map/LocationMarker',
  component: LocationMarker,
  argTypes: {
    heading: {
      control: { type: 'range', min: 0, max: 359, step: 1}
    },
    headingAccuracy: {
      control: { type: 'range', min: 0, max: 359, step: 1}
    },
    color: {control: 'color'}
  }
} as Meta;

const Template: Story<LocationMarkerProps> = args => {
  const [getViewport, setViewport] = useState(DEFAULT_VIEWPORT);
  return <Box sx={{width: '100vw', height: '100vh', position: 'relative', boxShadow: 1}}>
    <Map mapStyle={BASEMAPS[1].style} onViewportChange={setViewport} viewport={getViewport}>
      <LocationMarker {...args}/>
    </Map>
  </Box>;
};

export const Default = Template.bind({});
Default.args = {
  heading: 45,
  headingAccuracy: 45,
  color: '#4286f5',
  geolocation: {
    accuracy: null,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    latitude: 42.1094,
    longitude: 1.3705,
    speed: null,
    timestamp: Date.now()
  }
};
