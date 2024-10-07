import React from 'react';
import { StoryFn } from '@storybook/react';

import Stack from '@mui/material/Stack';
import BaseMapList, { BaseMapListProps } from './BaseMapList';
import { DRAWER_WIDTH } from '../../config';
import MapIcon from '@mui/icons-material/Map';
import Header from './Header';
import { primaryColor } from '../../theme';

const coreStyles = [
  {
    id: 'terrain',
    labels: {
      ca: 'OpenMapTiles Terrain',
      en: 'OpenMapTiles Terrain',
      es: 'OpenMapTiles Terrain',
    },
    thumbnail: 'https://tileserver.geomatico.es/styles/terrain/8/128/94.png',
    style: 'https://tileserver.geomatico.es/styles/terrain/style.json',
    sprites: 'https://cdn.geomatico.es/datasets/sprites.zip',
    attribution: 'Geomatico',
  },
  {
    id: 'bright',
    labels: {
      ca: 'OSM Bright',
      en: 'OSM Bright',
      es: 'OSM Bright',
    },
    thumbnail: 'https://tileserver.geomatico.es/styles/osm-bright/7/63/48.png',
    style: 'https://tileserver.geomatico.es/styles/osm-bright/style.json',
    sprites: 'https://cdn.geomatico.es/datasets/sprites.zip',
    attribution: 'Geomatico',
  },
];
const userStyles = [
  {
    id: 'galicia-osmbright',
    labels: {
      ca: 'OSM Bright Galicia',
      en: 'OSM Bright Galicia',
      es: 'OSM Bright Galicia',
    },
    thumbnail: 'https://tileserver.geomatico.es/styles/osm-bright/7/63/48.png',
    style: 'https://tileserver.geomatico.es/styles/osm-bright/style.json',
    sprites: undefined,
    attribution: 'Geomatico',
  },
];

export default {
  title: 'Common/BaseMapList',
  component: BaseMapList,
  argTypes: {
    selectedStyleId: {
      control: 'select',
      options: coreStyles
        .map((style) => style.id)
        .concat(userStyles.map((style) => style.id)),
    },
  },
};

const DeviceTemplate: StoryFn<BaseMapListProps> = (args) => (
  <Stack
    sx={{
      height: '800px',
      width: DRAWER_WIDTH,
      boxShadow: 3,
      overflow: 'hidden',
      m: 0,
      p: 0,
    }}
  >
    <Header startIcon={<MapIcon />} name="Mapas Base" color={primaryColor} />
    <BaseMapList {...args} />
  </Stack>
);

export const Default = {
  render: DeviceTemplate,

  args: {
    coreStyles: coreStyles,
    selectedStyleId: 'mtc25m',
  },
};

export const WithUserStyles = {
  render: DeviceTemplate,

  args: {
    coreStyles: coreStyles,
    userStyles: userStyles,
    selectedStyleId: 'mtc25m',
  },
};
