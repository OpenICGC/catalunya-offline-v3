import React, {useState} from 'react';
import {Meta, Story} from '@storybook/react';

import LocationMarker, {LocationMarkerProps} from './LocationMarker';
import {INITIAL_VIEWPORT, MAPSTYLES} from '../../config';
import Box from '@mui/material/Box';
import Map from '@geomatico/geocomponents/Map';

export default {
  title: 'Map/LocationMarker',
  component: LocationMarker
} as Meta;

const Template: Story<LocationMarkerProps> = args => {
  const [getViewport, setViewport] = useState(INITIAL_VIEWPORT);
  return <Box sx={{width: '100vw', height: '100vh', position: 'relative', boxShadow: 1}}>
    <Map mapStyle={MAPSTYLES[1].id} onViewportChange={setViewport} viewport={getViewport}>
      <LocationMarker {...args}/>
    </Map>
  </Box>;
};

export const Default = Template.bind({});
Default.args = {
  geolocation: {
    accuracy: null,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    latitude: 42.1094,
    longitude: 1.3705,
    speed: null,
    timestamp: Date.now()
  },
  orientation: {
    heading: 45,
    accuracy: 45
  }
};