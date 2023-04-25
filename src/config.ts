import {BaseMaps, HEXColor, OfflineDatasources} from './types/commonTypes';
import {ViewportType} from './hooks/singleton/useViewport';
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

export const FIT_BOUNDS_PADDING = 50;

export const MAP_PROPS = {
  minZoom: 6,
  maxZoom: 16,
  maxPitch: 68,
  hash: false
};

export const DEFAULT_VIEWPORT: ViewportType = {
  latitude: 40.5,
  longitude: 1.6,
  zoom: 6,
  bearing: 0,
  pitch: 0
};

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

const BASE_URL = 'https://cdn.geomatico.es/datasets';

const DATASET = 'icgc'; // 'mtc25m' 'catalunya' 'madrid' 'vigo' 'galicia'

export const OFFLINE_DATASOURCES: OfflineDatasources = [{
  'id': 'openmaptiles',
  'url': `${BASE_URL}/${DATASET}/openmaptiles.mbtiles`,
  'labels': {
    'ca': 'Cartografia base',
    'en': 'Base cartography',
    'es': 'Cartografía base'
  }
}, {
  'id': 'terrain',
  'url': `${BASE_URL}/${DATASET}/terrain.mbtiles`,
  'labels': {
    'ca': 'Terreny',
    'en': 'Terrain',
    'es': 'Terreno'
  }
}];

export const OFFLINE_GLYPHS = `${BASE_URL}/${DATASET}/glyphs.zip`;

export const BASEMAPS: BaseMaps = [{
  id: 'estandard',
  labels: {
    ca: 'Estàndard',
    en: 'Standard',
    es: 'Estándar'
  },
  style: `${BASE_URL}/${DATASET}/estandard.json`,
  thumbnail: `${BASE_URL}/${DATASET}/thumbnail-estandard.png`,
  sprites: `${BASE_URL}/${DATASET}/sprites-estandard.zip`
},{
  id: 'lleure',
  labels: {
    ca: 'Lleure',
    en: 'Outdoor',
    es: 'Ocio'
  },
  style: `${BASE_URL}/${DATASET}/lleure.json`,
  thumbnail: `${BASE_URL}/${DATASET}/thumbnail-lleure.png`,
  sprites: `${BASE_URL}/${DATASET}/sprites-lleure.zip`
}];
