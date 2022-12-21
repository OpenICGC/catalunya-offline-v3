import React, {useState} from 'react';
import {Meta, Story} from '@storybook/react';

import RecordingPanel, {RecordingPanelProps} from './RecordingPanel';
import {INITIAL_VIEWPORT, MAPSTYLES} from '../../config';
import Box from '@mui/material/Box';
import GeocomponentMap from '@geomatico/geocomponents/Map';

export default {
  title: 'Map/RecordingPanel',
  component: RecordingPanel,
  argTypes: {
    recordingStatus: {
      options: ['rec', 'pause', 'stop'],
      control: { type: 'inline-radio' },
    },
    time: {
      control: { type: 'range', min: 0, max: 190000, step: 1}
    }
  }
} as Meta;

const Template: Story<RecordingPanelProps> = args => <RecordingPanel {...args}/>;

// eslint-disable-next-line react/prop-types,no-unused-vars
const IntegrationTemplate: Story<RecordingPanelProps> = args => {
  const [getViewport, setViewport] = useState(INITIAL_VIEWPORT);
  return <Box sx={{ width: '100vw', height: '100vh', position: 'relative', boxShadow: 1 }}>
    <GeocomponentMap mapStyle={MAPSTYLES[1].id} onViewportChange={setViewport} viewport={getViewport}/>
    <RecordingPanel {...args}/>
  </Box>;
};

export const Default = Template.bind({});
Default.args = {
  isAccessibleSize: false,
  name: 'Montseny',
  color: '#973572',
  recordingStatus: 'rec',
  time: 10
};

export const WithMap = IntegrationTemplate.bind({});
WithMap.args = {
  ...Default.args,
  isAccessibleSize: false,
  color: '#973572'
};