import React, {useState} from 'react';
import {Meta, Story} from '@storybook/react';

import PrecisePositionEditor, {PrecisePositionEditorProps} from './PrecisePositionEditor';
import Box from '@mui/material/Box';
import GeocomponentMap from '@geomatico/geocomponents/Map';
import {INITIAL_VIEWPORT, MAPSTYLES} from '../../config';

export default {
  title: 'Scope/PrecisePositionEditor',
  component: PrecisePositionEditor,
  argTypes: {
    color: {control: 'color'}
  }
} as Meta;

const Template: Story<PrecisePositionEditorProps> = args => <PrecisePositionEditor {...args}/>;

// eslint-disable-next-line react/prop-types,no-unused-vars
const IntegrationTemplate: Story<PrecisePositionEditorProps> = args => {
  const [getViewport, setViewport] = useState(INITIAL_VIEWPORT);
  return <Box sx={{ width: '100vw', height: '100vh', position: 'relative', boxShadow: 1 }}>
    <GeocomponentMap mapStyle={MAPSTYLES[1].id} onViewportChange={setViewport} viewport={getViewport}/>
    <PrecisePositionEditor {...args}/>
  </Box>;
};

export const Default = Template.bind({});
Default.args = {
  isAccessibleSize: false,
  name: 'Montseny',
  color: '#973572'
};

export const WithMap = IntegrationTemplate.bind({});
WithMap.args = {
  ...Default.args
};
