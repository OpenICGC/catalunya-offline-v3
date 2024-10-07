import React from 'react';
import { StoryFn } from '@storybook/react';

import SchemaForm, { SchemaFormProps } from './SchemaForm';
import { v4 as uuidv4 } from 'uuid';
import Stack from '@mui/material/Stack';
import { DRAWER_WIDTH } from '../../config';

export default {
  title: 'Schema/SchemaForm',
  component: SchemaForm,
};

const stackSx = {
  height: '500px',
  width: DRAWER_WIDTH,
  boxShadow: 3,
  overflow: 'hidden',
  m: 0,
  p: 0,
};

const DeviceTemplate: StoryFn<SchemaFormProps> = (args) => (
  <Stack sx={stackSx}>
    <SchemaForm {...args} />
  </Stack>
);

export const Default = {
  args: {
    schema: [
      {
        id: uuidv4(),
        name: 'Denominación',
        appliesToPoints: true,
        appliesToTracks: true,
      },
      {
        id: uuidv4(),
        name: 'Siglo',
        appliesToPoints: true,
        appliesToTracks: false,
      },
      {
        id: uuidv4(),
        name: 'Conservación',
        appliesToPoints: false,
        appliesToTracks: true,
      },
      {
        id: uuidv4(),
        name: 'Conservación',
        appliesToPoints: false,
        appliesToTracks: true,
      },
    ],
  },
};

export const Device = {
  render: DeviceTemplate,

  args: {
    ...Default.args,
  },
};
