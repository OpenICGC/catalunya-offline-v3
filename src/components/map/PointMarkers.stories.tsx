import React, {useState} from 'react';
import {Meta, Story} from '@storybook/react';

import Box from '@mui/material/Box';
import Map from '@geomatico/geocomponents/Map';

import PointMarkers, {PointMarkersProps} from './PointMarkers';
import {INITIAL_VIEWPORT, MAPSTYLES} from '../../config';


export default {
  title: 'Map/PointMarkers',
  component: PointMarkers
} as Meta;

const Template: Story<PointMarkersProps> = args => {
  const [getViewport, setViewport] = useState(INITIAL_VIEWPORT);
  return <Box sx={{width: '100vw', height: '100vh', position: 'relative', boxShadow: 1}}>
    <Map mapStyle={MAPSTYLES[1].id} onViewportChange={setViewport} viewport={getViewport}>
      <PointMarkers {...args}/>
    </Map>
  </Box>;
};

export const Default = Template.bind({});
Default.args = {
  defaultColor: '#973572',
  points: [
    {
      type: 'Feature',
      id: '72eb724a-af27-4a5d-94bc-02f7a835c53d',
      geometry: {
        type: 'Point',
        coordinates: [1.2705, 42.1094]
      },
      properties: {
        name: 'Color per defecte',
        timestamp: 1671035830303,
        description: '',
        images: [],
        isVisible: true
      }
    },
    {
      type: 'Feature',
      id: 'f37d9130-6ad2-44ab-aa16-020614160e8a',
      geometry: {
        type: 'Point',
        coordinates: [1.3705, 42.1094]
      },
      properties: {
        name: 'Color explícit',
        timestamp: 1671040874109,
        color: '#FABADA',
        description: '',
        images: [],
        isVisible: true
      }
    },
    {
      type: 'Feature',
      id: 'f37d9130-6ad2-44ab-aa16-020614160e8a',
      geometry: {
        type: 'Point',
        coordinates: [1.4705, 42.1094]
      },
      properties: {
        name: 'No visible',
        timestamp: 1671040874109,
        color: '#FF0000',
        description: '',
        images: [],
        isVisible: false
      }
    }
  ]
};

export const NoPoints = Template.bind({});
NoPoints.args = {
};
