import React from 'react';
import {Meta, Story} from '@storybook/react';
import RecordingButtons, {RecordingButtonsProps} from './RecordingButtons';

//UTILS
import {RECORDING_STATUS} from '../map/RecordingPanel';

export default {
  title: 'Buttons/RecordingButtons',
  component: RecordingButtons,
  argTypes: {
    selectedButtonId: {
      options: {
        RECORDING: RECORDING_STATUS.RECORDING,
        PAUSE: RECORDING_STATUS.PAUSE, 
        STOP: RECORDING_STATUS.STOP
      },
      control: { type: 'inline-radio' },
    },
  }
} as Meta;

const Template: Story<RecordingButtonsProps> = args => <RecordingButtons {...args}/>;

export const Default = Template.bind({});
Default.args = {
  isAccessibleSize: false,
  selectedButtonId: RECORDING_STATUS.RECORDING
};