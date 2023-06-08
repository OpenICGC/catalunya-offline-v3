import React from 'react';
import {Meta, Story} from '@storybook/react';

import SchemaForm, {SchemaFormProps} from './SchemaForm';
import {v4 as uuidv4} from 'uuid';
import Stack from '@mui/material/Stack';
import {DRAWER_WIDTH} from '../../config';


export default {
  title: 'Schema/SchemaForm',
  component: SchemaForm
} as Meta;

const stackSx = {
  height: '500px',
  width: DRAWER_WIDTH,
  boxShadow: 3,
  overflow: 'hidden',
  m: 0,
  p: 0
};

const Template: Story<SchemaFormProps> = args => <SchemaForm {...args}/>;
const DeviceTemplate: Story<SchemaFormProps> = args => <Stack sx={stackSx}><SchemaForm {...args}/></Stack>;

export const Default = Template.bind({});
Default.args = {
  schemaFields: [
    {
      id: uuidv4(),
      name: 'Denominación',
      appliesToPoints: true,
      appliesToTracks: true
    },
    {
      id: uuidv4(),
      name: 'Siglo',
      appliesToPoints: true,
      appliesToTracks: false
    },
    {
      id: uuidv4(),
      name: 'Conservación',
      appliesToPoints: false,
      appliesToTracks: true
    },
    {
      id: uuidv4(),
      name: 'Conservación',
      appliesToPoints: false,
      appliesToTracks: true
    }
  ]
};

export const Device = DeviceTemplate.bind({});
Device.args = {
  ...Default.args
};