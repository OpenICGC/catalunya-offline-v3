import React from 'react';
import {Meta, Story} from '@storybook/react';

import CancelButton, {CancelButtonProps} from './CancelButton';

export default {
  title: 'Buttons/CancelButton',
  component: CancelButton,
  argTypes: {
    variant: {
      options: ['text', 'contained'],
      control: { type: 'inline-radio' },
    },
  }
} as Meta;

const Template: Story<CancelButtonProps> = args => <CancelButton {...args}/>;

export const Default = Template.bind({});
Default.args = {
  variant: 'text',
  isAccessibleSize: false
};