import React from 'react';
import {Meta, Story} from '@storybook/react';

import DateInput, {DateInputProps} from './DateInput';

export default {
  title: 'Scope/Inputs/DateInput',
  component: DateInput
} as Meta;

const Template: Story<DateInputProps> = args => <DateInput {...args}/>;

export const Default = Template.bind({});
Default.args = {
  isEditing: true,
  timestamp: Date.now(),
  sx: {
    '&.GenericInput-wrapper': {
      padding: '8px',
      marginBottom: '0px'
    },
    '& .GenericInput-title': {
      color: 'grey.600',
    }
  }
};