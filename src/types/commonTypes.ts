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

export type Entity = {
  id: UUID,
  name: string,
  color: HEXColor,
  isActive?: boolean
}

export type Scope = {
  id: UUID,
  name: string,
  color: HEXColor
}

export type ScopeChildren = {
  id: UUID,
  name: string,
  color?: HEXColor, // Optional, inherits Scope's color
  geometry?: GeoJSON.Geometry,
  timestamp: EpochTimeStamp, // In milliseconds https://w3c.github.io/hr-time/#the-epochtimestamp-typedef
  description: string,
  images: Array<ScopeImage>,
  isVisible: boolean
}

export type ScopePoint = ScopeChildren & {
  geometry: GeoJSON.Point
}

export type ScopePath = ScopeChildren & {
  geometry?: GeoJSON.LineString
}

export type ScopeImage = void; // TODO
