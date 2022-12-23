import React from 'react';
import {Meta, Story} from '@storybook/react';
import RecordingButtonGroup, {RecordingButtonGroupProps} from './RecordingButtonGroup';

//UTILS
import {RECORDING_STATUS} from '../map/RecordingPanel';

export default {
  title: 'Buttons/RecordingButtonGroup',
  component: RecordingButtonGroup,
  argTypes: {
    recordingStatus: {
      options: {
        RECORDING: RECORDING_STATUS.RECORDING,
        PAUSE: RECORDING_STATUS.PAUSE, 
        STOP: RECORDING_STATUS.STOP
      },
      control: { type: 'inline-radio' },
    },
  }
} as Meta;

const Template: Story<RecordingButtonGroupProps> = args => <RecordingButtonGroup {...args}/>;

export const Default = Template.bind({});
Default.args = {
  isAccessibleSize: false,
  recordingStatus: RECORDING_STATUS.RECORDING
};
