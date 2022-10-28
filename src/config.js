export const DRAWER_WIDTH = 300;
export const SM_BREAKPOINT = 600;

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
  maxPitch: 70,
  maxBounds: [0.055047, 40.434881, 3.420395, 42.956628],
  hash: false
};

export const MAPSTYLES = [
  {
    'label': 'VT Online',
    'thumbnail': '',
    'id': 'mapstyles/VT-online.json'
  },
  {
    'label': 'VT Offline',
    'thumbnail': '',
    'id': 'mapstyles/VT-offline.json'
  }
];

export const INITIAL_MAPSTYLE_URL = MAPSTYLES[0].id;
