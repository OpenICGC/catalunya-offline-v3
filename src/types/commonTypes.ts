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
  color: HEXColor
}

export type ScopeChild = {
  id: UUID,
  name: string,
  color?: HEXColor, // Optional, inherits Scope's color
  geometry?: GeoJSON.Geometry,
  timestamp: EpochTimeStamp, // In milliseconds https://w3c.github.io/hr-time/#the-epochtimestamp-typedef
  description: string,
  images: Array<ScopeImage>,
  isVisible: boolean
}

export type ScopePoint = ScopeChild & {
  geometry: GeoJSON.Point
}

export type ScopePath = ScopeChild & {
  geometry?: GeoJSON.LineString
}

export type ScopeImage = void; // TODO
