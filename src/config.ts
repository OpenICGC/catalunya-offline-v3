import {BaseMaps, HEXColor, OfflineDatasources} from './types/commonTypes';
import {ViewportType} from './hooks/singleton/useViewport';
import {Capacitor} from '@capacitor/core';
import useColorRamp from '@geomatico/geocomponents/hooks/useColorRamp';

export const DRAWER_WIDTH = 270;

export const MIN_TRACKING_ZOOM = 14;

export const GPS_POSITION_STALE_COLOR = '#9b9b9b';

export const OFFLINE_DATADIR_NAME = 'offlineData';
export const EXPORT_DIR_NAME = 'exports';

export const PLATFORM = Capacitor.getPlatform();
export const IS_WEB = PLATFORM === 'web';
export const IS_IOS = PLATFORM === 'ios';

export const PERSISTENCE_NAMESPACE = 'catoffline';

export const MAX_ALLOWED_IMPORT_FEATURES = 100;

export const FIT_BOUNDS_PADDING = 50;

export const MAP_PROPS = {
  minZoom: 6,
  maxZoom: 17,
  maxPitch: 68,
  hash: false
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

const DATASET: 'icgc' | 'mtc25m' | 'catalunya' | 'madrid' | 'vigo' | 'galicia' = 'icgc';

const BASE_URL = DATASET === 'icgc' ? 'https://datacloud.icgc.cat/datacloud/catalunya-offline' : `https://cdn.geomatico.es/datasets/${DATASET}`; // 'https://d3f7z3c5u0qoak.cloudfront.net';

const LATITUDES: Record<string, number> = {
  icgc: 40.5,
  mtc25m: 40.5,
  catalunya: 40.5,
  madrid: 40.417,
  vigo: 42.236,
  galicia: 42.755
};

const LONGITUDES: Record<string, number> = {
  icgc: 1.6,
  mtc25m: 1.6,
  catalunya: 1.6,
  madrid: -3.703,
  vigo: -8.727,
  galicia: -7.866
};

export const DEFAULT_VIEWPORT: ViewportType = {
  latitude: LATITUDES[DATASET],
  longitude: LONGITUDES[DATASET],
  zoom: 6,
  bearing: 0,
  pitch: 0
};

export const OFFLINE_DATASOURCES: OfflineDatasources = [{
  'id': 'openmaptiles',
  'url': `${BASE_URL}/openmaptiles.mbtiles`,
  'labels': {
    'ca': 'Cartografia base',
    'en': 'Base cartography',
    'es': 'Cartografía base'
  }
}, {
  'id': 'terrain',
  'url': `${BASE_URL}/terrain.mbtiles`,
  'labels': {
    'ca': 'Terreny',
    'en': 'Terrain',
    'es': 'Terreno'
  }
}];

export const OFFLINE_GLYPHS = `${BASE_URL}/glyphs.zip`;

export const BASEMAPS: BaseMaps = [{
  id: 'estandard',
  labels: {
    ca: 'Estàndard',
    en: 'Standard',
    es: 'Estándar'
  },
  style: `${BASE_URL}/estandard.json`,
  thumbnail: `${BASE_URL}/thumbnail-estandard.png`,
  sprites: `${BASE_URL}/sprites-estandard.zip`
},{
  id: 'lleure',
  labels: {
    ca: 'Lleure',
    en: 'Outdoor',
    es: 'Ocio'
  },
  style: `${BASE_URL}/lleure.json`,
  thumbnail: `${BASE_URL}/thumbnail-lleure.png`,
  sprites: `${BASE_URL}/sprites-lleure.zip`
},{
  id: 'ortofoto',
  labels: {
    ca: 'Ortofoto (només online)',
    en: 'Ortophoto (online only)',
    es: 'Ortofoto (solo online)'
  },
  style: 'https://geoserveis.icgc.cat/contextmaps/icgc_orto_estandard.json',
  thumbnail: `${BASE_URL}/thumbnail-ortofoto.png`
}];
