import GeoJSON from 'geojson';

export type MapStyle = {
  label: string,
  thumbnail: string,
  id: string
}

export type MapStyles = Array<MapStyle>

export type Manager = 'LAYERS' | 'BASEMAPS' | 'SCOPES' | undefined;

export interface CatOfflineError {
  code?: string;
  message?: string;
}

export type UUID = string;
export type HEXColor = `#${string}`;

export type Scope = {
  id: UUID,
  name: string,
  color: HEXColor,
  points: Array<ScopePoint>,
  paths: Array<ScopePath>
}

export type ScopeEntity = {
  id: UUID,
  name: string,
  color?: HEXColor, // Optional, inherits Scope's color
  geometry?: GeoJSON.Geometry,
  timestamp: EpochTimeStamp, // In milliseconds https://w3c.github.io/hr-time/#the-epochtimestamp-typedef
  description: string,
  images: Array<ScopeImage>,
  isVisible: boolean
}

export type ScopePoint = ScopeEntity & {
  geometry: GeoJSON.Point
}

export type ScopePath = ScopeEntity & {
  geometry?: GeoJSON.LineString
}

export type ScopeImage = void; // TODO
