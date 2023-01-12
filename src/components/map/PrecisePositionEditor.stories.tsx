import React, {useState} from 'react';
import {Meta, Story} from '@storybook/react';

import PrecisePositionEditor, {PrecisePositionEditorProps} from './PrecisePositionEditor';
import Box from '@mui/material/Box';
import GeocomponentMap from '@geomatico/geocomponents/Map';
import {INITIAL_VIEWPORT, BASEMAPS} from '../../config';

export default {
  title: 'Map/PrecisePositionEditor',
  component: PrecisePositionEditor,
  argTypes: {
    color: {control: 'color'}
  }
} as Meta;

const Template: Story<PrecisePositionEditorProps> = args => <PrecisePositionEditor {...args}/>;

const WithMapTemplate: Story<PrecisePositionEditorProps> = ({...args}) => {
  const [getViewport, setViewport] = useState(INITIAL_VIEWPORT);
  return <Box sx={{ width: '100vw', height: '100vh', position: 'relative', boxShadow: 1 }}>
    <GeocomponentMap mapStyle={BASEMAPS[1].onlineStyle} onViewportChange={setViewport} viewport={getViewport}/>
    <PrecisePositionEditor {...args}/>
  </Box>;
};

export const Default = Template.bind({});
Default.args = {
  isAccessibleSize: false,
  name: 'Montseny',
  color: '#973572'
};

export const WithMap = WithMapTemplate.bind({});
WithMap.args = {
  ...Default.args
};
