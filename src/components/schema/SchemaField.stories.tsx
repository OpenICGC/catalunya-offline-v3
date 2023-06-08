import React from 'react';
import {Meta, Story} from '@storybook/react';

import SchemaField, {SchemaFieldProps} from './SchemaField';
import {v4 as uuidv4} from 'uuid';
import Stack from '@mui/material/Stack';
import {DRAWER_WIDTH} from '../../config';


export default {
  title: 'Schema/SchemaField',
  component: SchemaField
} as Meta;

const stackSx = {
  height: '500px',
  width: DRAWER_WIDTH,
  boxShadow: 3,
  overflow: 'hidden',
  m: 0,
  p: 0
};

const Template: Story<SchemaFieldProps> = args => <SchemaField {...args}/>;
const DeviceTemplate: Story<SchemaFieldProps> = args => <Stack sx={stackSx}><SchemaField {...args}/></Stack>;

export const Default = Template.bind({});
Default.args = {
  schemaField: {
    id: uuidv4(),
    name: 'Patrimonio',
    appliesToPoints: true,
    appliesToTracks: false
  }
};

export const Device = DeviceTemplate.bind({});
Device.args = {
  ...Default.args
};