import React, { useState } from 'react';
import { StoryFn } from '@storybook/react';

import PositionEditor, { PositionEditorProps } from './PositionEditor';
import Box from '@mui/material/Box';
import GeocomponentMap from '@geomatico/geocomponents/Map/Map';
import { DEFAULT_VIEWPORT, BASEMAPS } from '../../config';

export default {
  title: 'Map/PositionEditor',
  component: PositionEditor,
  argTypes: {
    color: { control: 'color' },
  },
};

const WithMapTemplate: StoryFn<PositionEditorProps> = ({ ...args }) => {
  const [getViewport, setViewport] = useState(DEFAULT_VIEWPORT);
  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        boxShadow: 1,
      }}
    >
      <GeocomponentMap
        mapStyle={BASEMAPS[1].style}
        onViewportChange={setViewport}
        viewport={getViewport}
      />
      <PositionEditor {...args} />
    </Box>
  );
};

export const Default = {
  args: {
    name: 'Montseny',
    color: '#973572',
  },
};

export const WithMap = {
  render: WithMapTemplate,

  args: {
    ...Default.args,
  },
};
