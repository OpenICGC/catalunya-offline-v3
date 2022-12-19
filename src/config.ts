import {BaseMaps} from './types/commonTypes';
export const OFF_CAT = false;

export const DRAWER_WIDTH = 240;
export const SM_BREAKPOINT = 850;

export const INITIAL_MANAGER = 'SCOPES';

export const INITIAL_VIEWPORT = {
  latitude: 42.1094,
  longitude: 1.3705,
  zoom: 9,
  bearing: 0,
  pitch: 0,
};

export const MAP_PROPS = {
  minZoom: 7,
  maxZoom: 14.99,
  maxPitch: 60,
  ...(OFF_CAT ? {} : {maxBounds: [0.055047, 40.434881, 3.420395, 42.956628]}),
  hash: false
};

export const MBTILES = {
  downloadMbtilesUrl: 'https://cdn.geomatico.es/datasets/mtc25mcatoff_7a13SQLite.db',
  dbName: 'mtc25mcatoff_7a13'
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
  offlineAssets: 'https://cdn.geomatico.es/datasets/mtc25m/assets.json'
},{
  id: 'contextmaps',
  labels: {
    ca: 'ContextMaps',
    en: 'ContextMaps',
    es: 'ContextMaps'
  },
  thumbnail: 'https://visors.icgc.cat/contextmaps/imatges_estil/icgc_mapa_estandard.png',
  onlineStyle: 'https://geoserveis.icgc.cat/contextmaps/icgc_mapa_estandard.json'
}];

export const INITIAL_BASEMAP = BASEMAPS[OFF_CAT ? 1 : 0];

export const MIN_TRACKING_ZOOM = 14;

export const OFFLINE_DATADIR_NAME = 'offlineData';