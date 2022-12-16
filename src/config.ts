import {MapStyles} from './types/commonTypes';
import {ViewportType} from './hooks/useViewport';
export const OFF_CAT = false;

export const DRAWER_WIDTH = 270;
export const SM_BREAKPOINT = 850;

export const INITIAL_MANAGER = 'SCOPES';

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
  ...(OFF_CAT ? {} : {maxBounds: [0.055047, 40.434881, 3.420395, 42.956628]}),
  hash: false
};

export const MBTILES = {
  downloadMbtilesUrl: 'https://cdn.geomatico.es/datasets/mtc25mcatoff_7a13SQLite.db',
  dbName: 'mtc25mcatoff_7a13'
};

export const MAPSTYLES: MapStyles = [{
  label: 'mtc25m Offline',
  thumbnail: 'images/mtc25m.png',
  id: 'mapstyles/mtc25m-offline.json',
}, {
  label: 'mtc25m Online',
  thumbnail: 'images/mtc25m.png',
  id: 'mapstyles/mtc25m-online.json'
}, {
  label: 'ContextMaps',
  thumbnail: 'https://visors.icgc.cat/contextmaps/imatges_estil/icgc_mapa_estandard.png',
  id: 'https://geoserveis.icgc.cat/contextmaps/icgc_mapa_estandard.json'
}, {
  label: 'bt5m Complert',
  thumbnail: 'https://betaportal.icgc.cat/wordpress/wp-content/uploads/2017/03/bt5mnicetopo-150x150.png',
  id: 'mapstyles/bt5m-nice-alti.json'
}];

export const INITIAL_MAPSTYLE_URL = MAPSTYLES[OFF_CAT ? 2 : 0].id;

export const MIN_TRACKING_ZOOM = 14;

export const GPS_POSITION_COLOR = '#4286f5';