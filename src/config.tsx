import {MapStyles} from "./types/commonTypes";

export const DRAWER_WIDTH = 240;
export const SM_BREAKPOINT = 850;

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
  maxPitch: 65,
  maxBounds: [0.055047, 40.434881, 3.420395, 42.956628],
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
}];


export const INITIAL_MAPSTYLE_URL = MAPSTYLES[1].id;

export const MIN_TRACKING_ZOOM = 14;