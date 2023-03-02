import React from 'react';
import {Meta, Story} from '@storybook/react';
import RecordingButtonGroup, {RecordingButtonGroupProps} from './RecordingButtonGroup';

//UTILS
import {RECORDING_STATUS} from '../map/TrackRecorder';

export default {
  title: 'Buttons/RecordingButtonGroup',
  component: RecordingButtonGroup,
  argTypes: {
    recordingStatus: {
      options: {
        RECORDING: RECORDING_STATUS.RECORDING,
        PAUSED: RECORDING_STATUS.PAUSED,
        STOPPED: RECORDING_STATUS.STOPPED
      },
      control: { type: 'inline-radio' },
    },
  }
} as Meta;

const Template: Story<RecordingButtonGroupProps> = args => <RecordingButtonGroup {...args}/>;

export const Default = Template.bind({});
Default.args = {
  recordingStatus: RECORDING_STATUS.RECORDING
};
