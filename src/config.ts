import {BaseMaps, HEXColor, OfflineDatasources} from './types/commonTypes';
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

export const OFFLINE_GLYPHS = 'https://cdn.geomatico.es/datasets/glyphs.zip';

const TERRITORI = 'catalunya'; // 'vigo';

export const OFFLINE_DATASOURCES: OfflineDatasources = [{
  'id': 'openmaptiles',
  'url': `https://cdn.geomatico.es/datasets/${TERRITORI}/openmaptiles.mbtiles`,
  'labels': {
    'ca': 'Cartografia base',
    'en': 'Base cartography',
    'es': 'Cartografía base'
  }
}, {
  'id': 'terreny',
  'url': `https://cdn.geomatico.es/datasets/${TERRITORI}/terreny.mbtiles`,
  'labels': {
    'ca': 'Terreny',
    'en': 'Terrain',
    'es': 'Terreno'
  }
}, /*{
  'id': 'corbes',
  'url': `https://cdn.geomatico.es/datasets/${TERRITORI}/corbes.mbtiles`,
  'labels': {
    'ca': 'Corbes de nivell',
    'en': 'Contour lines',
    'es': 'Curvas de nivel'
  }
}*/];

export const BASEMAPS: BaseMaps = [{
  id: 'terrain',
  labels: {
    ca: 'OpenMapTiles Terrain (offline)',
    en: 'OpenMapTiles Terrain (offline)',
    es: 'OpenMapTiles Terrain (offline)'
  },
  thumbnail: 'https://tileserver.geomatico.es/styles/terrain/8/128/94.png',
  style: `https://cdn.geomatico.es/datasets/${TERRITORI}/terrain.json`
  //sprites: 'https://cdn.geomatico.es/datasets/sprites.zip'
},{
  id: 'outdoor',
  labels: {
    ca: 'MapTiler Outdoor (online)',
    en: 'MapTiler Outdoor (online)',
    es: 'MapTiler Outdoor (online)'
  },
  thumbnail: 'https://tileserver.geomatico.es/styles/terrain/8/128/94.png',
  style: 'https://api.maptiler.com/maps/outdoor-v2/style.json?key='+process.env.MAPTILER_API_KEY
}];

export const INITIAL_BASEMAP = BASEMAPS[0];
