import GeoJSON from 'geojson';

export type dataUrl = string;
export type base64string = string;
export type mimeType = 'application/geo+json' | 'application/gpx+xml' | 'application/vnd.google-earth.kml+xml' | 'text/csv' | 'application/zip';

export interface IGeodataLoader {
  load: (data: dataUrl | Blob) => Promise<GeoJSON.FeatureCollection>
}
