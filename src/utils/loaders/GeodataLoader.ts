import GeoJSON from 'geojson';

export interface IGeodataLoader {
  load: (data: string | Blob) => Promise<GeoJSON.FeatureCollection>
}
