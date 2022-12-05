import React, {useState} from 'react';
import {Meta, Story} from '@storybook/react';

import PrecisePositionEditor, {PrecisePositionEditorProps} from './PrecisePositionEditor';
import Box from '@mui/material/Box';
import GeocomponentMap from '@geomatico/geocomponents/Map';
import {v4 as uuidv4} from 'uuid';
import {INITIAL_VIEWPORT, MAPSTYLES} from '../../config';

export default {
  title: 'Scope/PrecisePositionEditor',
  component: PrecisePositionEditor
} as Meta;

const Template: Story<PrecisePositionEditorProps> = args => <PrecisePositionEditor {...args}/>;

// eslint-disable-next-line react/prop-types,no-unused-vars
const IntegrationTemplate: Story<PrecisePositionEditorProps> = ({viewport, ...args}) => {
  const [getViewport, setViewport] = useState(viewport);
  const onChange = (newViewport: {latitude: number, longitude: number, zoom: number, bearing: number, pitch: number}) => setViewport(newViewport);
  return <Box sx={{ width: '100vw', height: '100vh', position: 'relative', boxShadow: 1 }}>
    <GeocomponentMap mapStyle={MAPSTYLES[3].id} onViewportChange={onChange} viewport={getViewport}/>
    <PrecisePositionEditor viewport={getViewport} {...args}/>
  </Box>;
};

export const Default = Template.bind({});
Default.args = {
  scope: {
    id: uuidv4(),
    name: 'Montseny',
    color: '#fabada'
  },
  viewport: INITIAL_VIEWPORT,
  isLeftHanded: false,
  isAccessibleSize: false
};

export const WithMap = IntegrationTemplate.bind({});
WithMap.args = {
  ...Default.args,
};