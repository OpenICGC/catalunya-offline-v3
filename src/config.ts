import {BaseMaps} from './types/commonTypes';
import {ViewportType} from './hooks/useViewport';
import {Capacitor} from '@capacitor/core';

export const DRAWER_WIDTH = 270;

export const INITIAL_VIEWPORT: ViewportType = {
  latitude: 42.1094,
  longitude: 1.3705,
  zoom: 9,
  bearing: 0,
  pitch: 0,
};

export const MAP_PROPS = {
  minZoom: 7,
  maxZoom: 14.99, // 17,
  maxPitch: 60,
  hash: false
};

export const BASEMAPS: BaseMaps = [{
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
},{
  id: 'contextmaps',
  labels: {
    ca: 'ContextMaps',
    en: 'ContextMaps',
    es: 'ContextMaps'
  },
  thumbnail: 'https://visors.icgc.cat/contextmaps/imatges_estil/icgc_mapa_estandard.png',
  onlineStyle: 'https://geoserveis.icgc.cat/contextmaps/icgc_mapa_estandard.json',
  attribution: 'Institut Cartogràfic i Geològic de Catalunya'
},{
  id: 'bt5m',
  labels: {
    ca: 'bt5m Complert',
    en: 'bt5m Complete',
    es: 'bt5m Completo'
  },
  thumbnail: 'https://betaportal.icgc.cat/wordpress/wp-content/uploads/2017/03/bt5mnicetopo-150x150.png',
  onlineStyle: 'mapstyles/bt5m-nice-alti.json',
  attribution: 'Institut Cartogràfic i Geològic de Catalunya'
},{
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
},{
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
}];

export const INITIAL_BASEMAP = BASEMAPS[0];

export const MIN_TRACKING_ZOOM = 14;

export const GPS_POSITION_COLOR = '#4286f5';
export const GPS_POSITION_INACTIVE_COLOR = '#9b9b9b';

export const OFFLINE_DATADIR_NAME = 'offlineData';
export const EXPORT_DIR_NAME = 'exports';

export const PLATFORM = Capacitor.getPlatform();
export const IS_WEB = PLATFORM === 'web';

export const PERSISTENCE_NAMESPACE = 'catoffline';

export const COLOR_PALETTES = [
  [ '#ffffe5', '#f7fcb9', '#d9f0a3', '#addd8e', '#78c679', '#41ab5d', '#238443', '#006837', '#004529' ],
  [ '#ffffd9', '#edf8b1', '#c7e9b4', '#7fcdbb', '#41b6c4', '#1d91c0', '#225ea8', '#253494', '#081d58' ],
  [ '#fff7fb', '#ece2f0', '#d0d1e6', '#a6bddb', '#67a9cf', '#3690c0', '#02818a', '#016c59', '#014636' ],
  [ '#fff7f3', '#fde0dd', '#fcc5c0', '#fa9fb5', '#f768a1', '#dd3497', '#ae017e', '#7a0177', '#49006a' ],
  [ '#ffffcc', '#ffeda0', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#bd0026', '#800026' ],
  [ '#fcfbfd', '#efedf5', '#dadaeb', '#bcbddc', '#9e9ac8', '#807dba', '#6a51a3', '#54278f', '#3f007d' ],
  [ '#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b' ],
  [ '#f7fcf5', '#e5f5e0', '#c7e9c0', '#a1d99b', '#74c476', '#41ab5d', '#238b45', '#006d2c', '#00441b' ],
  [ '#fff5f0', '#fee0d2', '#fcbba1', '#fc9272', '#fb6a4a', '#ef3b2c', '#cb181d', '#a50f15', '#67000d' ],
  [ '#ffffff', '#f0f0f0', '#d9d9d9', '#bdbdbd', '#969696', '#737373', '#525252', '#252525', '#000000' ],
  [ '#762a83', '#9970ab', '#c2a5cf', '#e7d4e8', '#f7f7f7', '#d9f0d3', '#a6dba0', '#5aae61', '#1b7837' ],
  [ '#d53e4f', '#f46d43', '#fdae61', '#fee08b', '#ffffbf', '#e6f598', '#abdda4', '#66c2a5', '#3288bd' ],
  [ '#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6' ],
  [ '#fbb4ae', '#b3cde3', '#ccebc5', '#decbe4', '#fed9a6', '#ffffcc', '#e5d8bd', '#fddaec', '#f2f2f2' ],
  [ '#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999' ],
  [ '#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5', '#d9d9d9' ],
].filter(palette => palette.length === 9)
  .map(paletteArray => paletteArray.reduce<Record<string,string>>((paletteObject, color) => {
    paletteObject[color] = color;
    return paletteObject;
  }, {}));

