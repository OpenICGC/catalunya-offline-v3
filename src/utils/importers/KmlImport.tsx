import * as converter from '@tmcw/togeojson';
import {DOMParser} from 'xmldom';
import {ScopePoint, ScopeTrack} from '../../types/commonTypes';
import {GeoJSONImport} from './GeoJSONImport';

interface ScopeImportResults {
  points: Array<ScopePoint>,
  tracks: Array<ScopeTrack>,
  numberOfErrors: number
}

export const KmlImport: (data: string) => ScopeImportResults = (data) => {
  const kml = new DOMParser().parseFromString(data, 'utf-8');
  const kmlFromGpx = converter.kml(kml);
  const kmlFormatted = {
    ...kmlFromGpx,
    features: kmlFromGpx.features.map(feature => {
      if (feature?.geometry?.type === 'Point') {
        return {
          ...feature,
          properties: {
            ...feature.properties,
            description: feature.properties && feature.properties.desc && typeof feature.properties.desc === 'string' ? feature.properties.desc : '',
            color: feature.properties ? feature.properties['icon-color'] : undefined
          },
          geometry: {
            ...feature.geometry,
            coordinates: feature.geometry.coordinates
          }
        };
      } else if (feature.geometry?.type === 'LineString') {
        return {
          ...feature,
          properties: {
            ...feature.properties,
            description: feature.properties && feature.properties.desc && typeof feature.properties.desc === 'string' ? feature.properties.desc : '',
            color: feature.properties && feature.properties.stroke
          },
          geometry: {
            ...feature.geometry,
            coordinates: feature.geometry.coordinates
          }
        };
      } else {
        return {
          type: 'Feature',
          features: []
        };
      }
    })
  };

  if(kmlFromGpx.features.length === 0) {
    return {
      points: [],
      tracks: [],
      numberOfErrors: 1
    };
  } else {
    //return kmlFromGpx;
    //return kmlFormatted;
    return GeoJSONImport(kmlFormatted);
  }
};