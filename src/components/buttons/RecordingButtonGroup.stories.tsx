import RecordingButtonGroup from './RecordingButtonGroup';

//UTILS
import { RECORDING_STATUS } from '../map/TrackRecorder';

export default {
  title: 'Buttons/RecordingButtonGroup',
  component: RecordingButtonGroup,
  argTypes: {
    recordingStatus: {
      options: {
        RECORDING: RECORDING_STATUS.RECORDING,
        PAUSED: RECORDING_STATUS.PAUSED,
        STOPPED: RECORDING_STATUS.STOPPED,
      },
      control: { type: 'inline-radio' },
    },
  },
};

export const Default = {
  args: {
    recordingStatus: RECORDING_STATUS.RECORDING,
  },
};
