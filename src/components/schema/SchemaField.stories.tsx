import React from 'react';
import {Meta, Story} from '@storybook/react';

import SchemaField, {SchemaFieldProps} from './SchemaField';
import {v4 as uuidv4} from 'uuid';


export default {
  title: 'Schema/SchemaField',
  component: SchemaField
} as Meta;

const Template: Story<SchemaFieldProps> = args => <SchemaField {...args}/>;

export const Default = Template.bind({});
Default.args = {
  id: uuidv4(),
  name: 'Patrimonio',
  appliesToPoints: true,
  appliesToTracks: false,
  error: ''
};

export const Error = Template.bind({});
Error.args = {
  id: uuidv4(),
  name: 'Patrimonio',
  appliesToPoints: true,
  appliesToTracks: false,
  error: 'No pueden existir campos vacíos'
};