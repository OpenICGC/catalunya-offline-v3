import React from 'react';
import { StoryFn } from '@storybook/react';

import SchemaField, { SchemaFieldProps } from './SchemaField';
import { v4 as uuidv4 } from 'uuid';
import Stack from '@mui/material/Stack';
import { DRAWER_WIDTH } from '../../config';

export default {
  title: 'Schema/SchemaField',
  component: SchemaField,
};

const stackSx = {
  height: '500px',
  width: DRAWER_WIDTH,
  boxShadow: 3,
  overflow: 'hidden',
  m: 0,
  p: 0,
};

const DeviceTemplate: StoryFn<SchemaFieldProps> = (args) => (
  <Stack sx={stackSx}>
    <SchemaField {...args} />
  </Stack>
);

export const Default = {
  args: {
    schemaField: {
      id: uuidv4(),
      name: 'Patrimonio',
      appliesToPoints: true,
      appliesToTracks: false,
    },
  },
};

export const Device = {
  render: DeviceTemplate,

  args: {
    ...Default.args,
  },
};
