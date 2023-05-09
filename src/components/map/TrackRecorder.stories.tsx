import React, {useState} from 'react';
import {Meta, Story} from '@storybook/react';

import Box from '@mui/material/Box';
import TrackRecorder, {TrackRecorderProps} from './TrackRecorder';
import GeocomponentMap from '@geomatico/geocomponents/Map/Map';
import {DEFAULT_VIEWPORT, BASEMAPS} from '../../config';

export default {
  title: 'Map/TrackRecorder',
  component: TrackRecorder,
  argTypes: {
    elapsedTime: {
      control: { type: 'range', min: 0, max: 86400, step: 1}
    }
  }
} as Meta;

const Template: Story<TrackRecorderProps> = args => <TrackRecorder {...args}/>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const WithMapTemplate: Story<TrackRecorderProps> = ({...args}) => {
  const [getViewport, setViewport] = useState(DEFAULT_VIEWPORT);
  return <Box sx={{ width: '100vw', height: '100vh', position: 'relative', boxShadow: 1 }}>
    <GeocomponentMap mapStyle={BASEMAPS[1].style} onViewportChange={setViewport} viewport={getViewport}/>
    <TrackRecorder {...args}/>
  </Box>;
};

export const Default = Template.bind({});
Default.args = {
  name: 'Traza 01',
  color: '#973572',
  startTime: Date.now()
};

export const WithMap = WithMapTemplate.bind({});
WithMap.args = {
  ...Default.args
};
