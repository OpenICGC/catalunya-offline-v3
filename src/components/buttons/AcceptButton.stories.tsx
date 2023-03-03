import React from 'react';
import {Meta, Story} from '@storybook/react';

import AcceptButton, {AcceptButtonProps} from './AcceptButton';

export default {
  title: 'Buttons/AcceptButton',
  component: AcceptButton,
  argTypes: {
    variant: {
      options: ['text', 'contained'],
      control: { type: 'inline-radio' },
    },
  }
} as Meta;

const Template: Story<AcceptButtonProps> = args => <AcceptButton {...args}/>;

export const Default = Template.bind({});
Default.args = {
  variant: 'text',
  disabled: false
};