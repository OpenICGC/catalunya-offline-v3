import React from 'react';
import {Meta, Story} from '@storybook/react';

import Stack from '@mui/material/Stack';
import BaseMapList, {BaseMapListProps} from './BaseMapList';
import {DRAWER_WIDTH} from '../../config';
import MapIcon from '@mui/icons-material/Map';
import Header from './Header';
import {primaryColor} from '../../theme';

const coreStyles = [
  {
    id: 'mtc25m',
    labels: {
      ca: 'Mapa Topogràfic 1:25 000',
      en: 'Topographic Map 1:25 000',
      es: 'Mapa Topográfico 1:25 000'
    },
    thumbnail: 'images/mtc25m.png',
    onlineStyle: 'mapstyles/mtc25m-online.json',
    offlineAssets: 'https://cdn.geomatico.es/datasets/mtc25m/assets.json',
    attribution: 'Institut Cartogràfic i Geològic de Catalunya'
  },
  {
    id: 'contextmaps',
    labels: {
      ca: 'ContextMaps',
      en: 'ContextMaps',
      es: 'ContextMaps'
    },
    thumbnail: 'https://visors.icgc.cat/contextmaps/imatges_estil/icgc_mapa_estandard.png',
    onlineStyle: 'https://geoserveis.icgc.cat/contextmaps/icgc_mapa_estandard.json',
    attribution: 'Institut Cartogràfic i Geològic de Catalunya'
  },
  {
    id: 'bt5m',
    labels: {
      ca: 'bt5m Complert',
      en: 'bt5m Complete',
      es: 'bt5m Completo'
    },
    thumbnail: 'https://betaportal.icgc.cat/wordpress/wp-content/uploads/2017/03/bt5mnicetopo-150x150.png',
    onlineStyle: 'mapstyles/bt5m-nice-alti.json',
    attribution: 'Institut Cartogràfic i Geològic de Catalunya'
  }];
const userStyles = [
  {
    id: 'galicia-osmbright',
    labels: {
      ca: 'OSM Bright Galicia',
      en: 'OSM Bright Galicia',
      es: 'OSM Bright Galicia'
    },
    thumbnail: 'https://tileserver.geomatico.es/styles/osm-bright/7/63/48.png',
    onlineStyle: 'https://tileserver.geomatico.es/styles/osm-bright/style.json',
    offlineAssets: 'https://cdn.geomatico.es/datasets/galicia/assets.json',
    attribution: 'OpenStreetMap'
  },
  {
    id: 'madrid-osmbright',
    labels: {
      ca: 'OSM Bright Madrid',
      en: 'OSM Bright Madrid',
      es: 'OSM Bright Madrid'
    },
    thumbnail: 'https://tileserver.geomatico.es/styles/osm-bright/7/63/48.png',
    onlineStyle: 'https://tileserver.geomatico.es/styles/osm-bright/style.json',
    offlineAssets: 'https://cdn.geomatico.es/datasets/madrid/assets.json',
    attribution: 'OpenStreetMap'
  }
];

export default {
  title: 'Common/BaseMapList',
  component: BaseMapList,
  argTypes: {
    color: {control: 'color'}
  }
} as Meta;

const DeviceTemplate: Story<BaseMapListProps> = args =>
  <Stack sx={{
    height: '800px',
    width: DRAWER_WIDTH,
    boxShadow: 3,
    overflow: 'hidden',
    m: 0,
    p: 0
  }}>
    <Header
      startIcon={<MapIcon/>}
      name='Mapas Base'
      color={primaryColor}
    />
    <BaseMapList {...args}/>
  </Stack>;

export const Default = DeviceTemplate.bind({});
Default.args = {
  coreStyles: coreStyles,
  selectedStyleId: 'mtc25m'
};

export const WithUserStyles = DeviceTemplate.bind({});
WithUserStyles.args = {
  coreStyles: coreStyles,
  userStyles: userStyles,
  selectedStyleId: 'mtc25m'
};