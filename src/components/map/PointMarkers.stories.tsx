import React, { useState } from 'react';
import { StoryFn } from '@storybook/react';

import Box from '@mui/material/Box';
import Map from '@geomatico/geocomponents/Map/Map';

import PointMarkers, { PointMarkersProps } from './PointMarkers';
import { DEFAULT_VIEWPORT, BASEMAPS } from '../../config';

export default {
  title: 'Map/PointMarkers',
  component: PointMarkers,
};

const Template: StoryFn<PointMarkersProps> = (args) => {
  const [getViewport, setViewport] = useState(DEFAULT_VIEWPORT);
  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        boxShadow: 1,
      }}
    >
      <Map
        mapStyle={BASEMAPS[1].id}
        onViewportChange={setViewport}
        viewport={getViewport}
      >
        <PointMarkers {...args} />
      </Map>
    </Box>
  );
};

export const Default = {
  render: Template,

  args: {
    defaultColor: '#973572',
    points: [
      {
        type: 'Feature',
        id: '72eb724a-af27-4a5d-94bc-02f7a835c53d',
        geometry: {
          type: 'Point',
          coordinates: [1.2705, 42.1094],
        },
        properties: {
          name: 'Color per defecte',
          timestamp: 1671035830303,
          description: '',
          images: [],
          isVisible: true,
        },
      },
      {
        type: 'Feature',
        id: 'f37d9130-6ad2-44ab-aa16-020614160e8a',
        geometry: {
          type: 'Point',
          coordinates: [1.3705, 42.1094],
        },
        properties: {
          name: 'Color explícit',
          timestamp: 1671040874109,
          color: '#973572',
          description: '',
          images: [],
          isVisible: true,
        },
      },
      {
        type: 'Feature',
        id: 'f37d9130-6ad2-44ab-aa16-020614160e8a',
        geometry: {
          type: 'Point',
          coordinates: [1.4705, 42.1094],
        },
        properties: {
          name: 'No visible',
          timestamp: 1671040874109,
          color: '#FF0000',
          description: '',
          images: [],
          isVisible: false,
        },
      },
    ],
  },
};

export const NoPoints = {
  render: Template,

  args: {},
};
