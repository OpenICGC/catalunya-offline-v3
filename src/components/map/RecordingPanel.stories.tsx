import React, {useState} from 'react';
import {Meta, Story} from '@storybook/react';

import RecordingPanel, {RECORDING_STATUS, RecordingPanelProps} from './RecordingPanel';
import {INITIAL_VIEWPORT, MAPSTYLES} from '../../config';
import Box from '@mui/material/Box';
import GeocomponentMap from '@geomatico/geocomponents/Map';

export default {
  title: 'Map/RecordingPanel',
  component: RecordingPanel,
  argTypes: {
    recordingStatus: {
      options: {
        INITIAL: RECORDING_STATUS.INITIAL,
        RECORDING: RECORDING_STATUS.RECORDING,
        PAUSE: RECORDING_STATUS.PAUSE,
        STOP: RECORDING_STATUS.STOP
      },
      control: { type: 'inline-radio' },
    },
    time: {
      control: { type: 'range', min: 0, max: 190000, step: 1}
    }
  }
} as Meta;

const Template: Story<RecordingPanelProps> = args => <RecordingPanel {...args}/>;

// eslint-disable-next-line react/prop-types,no-unused-vars
const ManagedTemplate: Story<RecordingPanelProps> = ({recordingStatus, onStatusChange, ...args}) => {
  const [getValue, setValue] = useState(recordingStatus);
  return <>
    <RecordingPanel recordingStatus={getValue} onStatusChange={setValue} {...args} />
  </>;
};

// eslint-disable-next-line react/prop-types,no-unused-vars
const WithMapTemplate: Story<RecordingPanelProps> = ({recordingStatus, onStatusChange, ...args}) => {
  const [getValue, setValue] = useState(recordingStatus);
  const [getViewport, setViewport] = useState(INITIAL_VIEWPORT);
  return <Box sx={{ width: '100vw', height: '100vh', position: 'relative', boxShadow: 1 }}>
    <GeocomponentMap mapStyle={MAPSTYLES[1].id} onViewportChange={setViewport} viewport={getViewport}/>
    <RecordingPanel recordingStatus={getValue} onStatusChange={setValue} {...args}/>
  </Box>;
};

export const Default = Template.bind({});
Default.args = {
  isAccessibleSize: false,
  name: 'Traza 01',
  color: '#973572',
  recordingStatus: RECORDING_STATUS.INITIAL,
  time: 10
};

export const Managed = ManagedTemplate.bind({});
Managed.args = {
  ...Default.args
};

export const WithMap = WithMapTemplate.bind({});
WithMap.args = {
  ...Default.args,
  isAccessibleSize: false,
  color: '#973572'
};