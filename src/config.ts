import {BaseMaps, HEXColor} from './types/commonTypes';
import {ViewportType} from './hooks/useViewport';
import {Capacitor} from '@capacitor/core';
import useColorRamp from '@geomatico/geocomponents/hooks/useColorRamp';

export const DRAWER_WIDTH = 270;

export const MIN_TRACKING_ZOOM = 10;

export const GPS_POSITION_STALE_COLOR = '#9b9b9b';

export const OFFLINE_DATADIR_NAME = 'offlineData';
export const EXPORT_DIR_NAME = 'exports';

export const PLATFORM = Capacitor.getPlatform();
export const IS_WEB = PLATFORM === 'web';

export const PERSISTENCE_NAMESPACE = 'catoffline';

export const MAX_ALLOWED_IMPORT_FEATURES = 100;

export const MAP_PROPS = {
  minZoom: 7,
  maxZoom: 14.99, // 17,
  maxPitch: 60,
  hash: false
};

export const DEFAULT_VIEWPORT: ViewportType = {
  latitude: 42.1094,
  longitude: 1.3705,
  zoom: 9,
  bearing: 0,
  pitch: 0
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

export const COLOR_PALETTES = [
  'BrewerPastel19',
  'BrewerSet39',
  'BrewerSet19',
  'BrewerPaired9',
  'BrewerYlGn9',
  'BrewerYlGnBu9',
  'BrewerPuBuGn9',
  'BrewerRdPu9',
  'BrewerYlOrRd9',
  'BrewerPurples9',
  'BrewerBlues9',
  'BrewerGreens9',
  'BrewerReds9',
  'BrewerGreys9',
  'BrewerPRGn9',
  'BrewerSpectral9'
].reduce<Record<string, Array<HEXColor>>>((obj, paletteName) => ({
  ...obj,
  [paletteName]: useColorRamp(paletteName).hexColors
}), {});
