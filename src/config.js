import React from 'react';
import MapIcon from '@mui/icons-material/Map';
import TableChartIcon from '@mui/icons-material/TableChart';

export const DRAWER_WIDTH = 300;
export const SM_BREAKPOINT = 600;
export const MINI_SIDE_PANEL_WIDTH = 61;
export const MINI_SIDE_PANEL_DENSE_WIDTH = 45;

export const MINISIDEPANEL_CONFIG = [
  {id: 'mapView', route: '../map', label: 'map', content: <MapIcon/>},
  {id: 'detailView', route: '../detail', label: 'detail', content: <TableChartIcon/>}
];

export const INITIAL_VIEWPORT = {
  latitude: 41.4,
  longitude: 2.2,
  zoom: 5,
  bearing: 0,
  pitch: 0
};

export const MAPSTYLES = [
  {
    'label': 'Hibrid',
    'thumbnail': 'https://openicgc.github.io/img/orto.png',
    'id': 'https://geoserveis.icgc.cat/contextmaps/hibrid.json',
    'firstTopLayer': 'place-other'
  },
  {
    'label': 'OSM Bright',
    'thumbnail': 'https://openicgc.github.io/img/osm-bright.png',
    'id': 'https://geoserveis.icgc.cat/contextmaps/osm-bright.json',
    'firstTopLayer': 'place-other'
  },
  {
    'label': 'Positron',
    'thumbnail': 'https://openicgc.github.io/img/positron.png',
    'id': 'https://geoserveis.icgc.cat/contextmaps/positron.json',
    'firstTopLayer': 'place_other'
  },
  {
    'label': 'Full Dark',
    'thumbnail': 'https://openicgc.github.io/img/fulldark.png',
    'id': 'https://geoserveis.icgc.cat/contextmaps/fulldark.json',
    'firstTopLayer': 'place-other'
  }
];

export const INITIAL_MAPSTYLE_URL = MAPSTYLES[1].id;