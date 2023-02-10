import * as converter from '@tmcw/togeojson';
import {DOMParser} from 'xmldom';
import {GeoJSONImport} from './GeoJSONImport';


export const GpxImport = (data: string) => {
  const gpx = new DOMParser().parseFromString(data, 'utf-8');
  const geoJsonFromGpx = converter.gpx(gpx);

  const geoJsonFormatted = {
    ...geoJsonFromGpx,
    features: geoJsonFromGpx.features.map(feature => (
      {
        ...feature,
        properties: {
          ...feature.properties,
          description: feature.properties ? feature.properties.cmt ? feature.properties.cmt : feature.properties.desc : '',
        }
      }
    ))
  };
  //return geoJsonFromGpx;
  return GeoJSONImport(geoJsonFormatted);
};