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

export interface ScopeFeature extends GeoJSON.Feature<GeoJSON.Geometry | null> {
  type: 'Feature',
  id: UUID,
  geometry: GeoJSON.Geometry | null,
  properties: {
    name: string,
    color?: HEXColor, // Optional, inherits Scope's color
    timestamp: EpochTimeStamp, // In milliseconds https://w3c.github.io/hr-time/#the-epochtimestamp-typedef
    description: string,
    images: Array<ScopeImage>,
    isVisible: boolean
  }
}

export interface ScopePoint extends ScopeFeature {
  geometry: GeoJSON.Point// Point geometry is required (not nullable)
}

export interface ScopeTrack extends ScopeFeature {
  geometry: GeoJSON.LineString | null // Track geometry is nullable
}

export type ScopeImage = {
  id: UUID,
  url: string,
  name: string,
  contentType: string,
  isLoading: boolean
}
