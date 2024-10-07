import React from 'react';
import { StoryFn } from '@storybook/react';

import PointPanel, { PointPanelProps } from './PointPanel';

import { v4 as uuidv4 } from 'uuid';
import { DRAWER_WIDTH } from '../../config';
import Stack from '@mui/material/Stack';

export default {
  title: 'Scope/PointPanel',
  component: PointPanel,
};

const DeviceTemplate: StoryFn<PointPanelProps> = (args) => (
  <Stack
    sx={{
      height: '800px',
      width: DRAWER_WIDTH,
      boxShadow: 3,
      overflow: 'hidden',
      m: 0,
      p: 0,
    }}
  >
    <PointPanel {...args} />
  </Stack>
);
const SmallDeviceTemplate: StoryFn<PointPanelProps> = (args) => (
  <Stack
    sx={{
      height: '500px',
      width: DRAWER_WIDTH,
      boxShadow: 3,
      overflow: 'hidden',
      m: 0,
      p: 0,
    }}
  >
    <PointPanel {...args} />
  </Stack>
);

export const Default = {
  args: {
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
        },
      ],
    },
    point: {
      type: 'Feature',
      id: uuidv4(),
      geometry: {
        type: 'Point',
        coordinates: [40.41123456, -3.68123456, 1225],
      },
      properties: {
        name: 'Masía',
        color: undefined,
        timestamp: Date.now(),
        description:
          'Había un árbol con el tronco torcido en medio del camino.',
        images: [...Array(3).keys()].map(
          (i) => `https://picsum.photos/300/20${i}`,
        ),
        isVisible: true,
      },
      schemaValues: {
        '380148a0-d32e-4822-bac6-3875f664f8c5': 'Valor Conservación',
        '523148a1-e45f-7676-bac8-1234f789f9c9': 'Valor Altura',
      },
    },
    numPoints: 13,
    numTracks: 5,
    isEditing: false,
  },
};

export const Device = {
  render: DeviceTemplate,

  args: {
    ...Default.args,
  },
};

export const SmallDevice = {
  render: SmallDeviceTemplate,

  args: {
    ...Default.args,
  },
};
