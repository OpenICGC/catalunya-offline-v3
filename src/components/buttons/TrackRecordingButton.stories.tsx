import React from 'react';
import {Meta, Story} from '@storybook/react';

import TrackRecordingButton, {TrackRecordingButtonProps} from './TrackRecordingButton';

export default {
  title: 'Buttons/TrackRecordingButton',
  component: TrackRecordingButton,
  argTypes: {
    selectedControlId: {
      options: ['rec', 'pause', 'stop'],
      control: { type: 'inline-radio' },
    },
  }
} as Meta;

const Template: Story<TrackRecordingButtonProps> = args => <TrackRecordingButton {...args}/>;

export const Default = Template.bind({});
Default.args = {
  isAccessibleSize: false,
  selectedControlId: 'rec'
};