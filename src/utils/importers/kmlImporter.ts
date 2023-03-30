import * as converter from '@tmcw/togeojson';
import {DOMParser} from 'xmldom';
import {ScopePoint, ScopeTrack} from '../../types/commonTypes';
import geoJSONImporter from './geoJSONImporter';
import {Feature, FeatureCollection} from 'geojson';

interface ScopeImportResults {
  points: Array<ScopePoint>,
  tracks: Array<ScopeTrack>,
  numberOfErrors: number
}

const kmlImporter: (data: string) => ScopeImportResults = (data) => {
  const kml = new DOMParser().parseFromString(data, 'utf-8');
  const geoJsonFromConverter = converter.kml(kml);
  const geoJsonForImporter: FeatureCollection = {
    ...geoJsonFromConverter,
    features: geoJsonFromConverter.features
      .filter(feature => feature.geometry !== null)
      .map(feature => ({
        ...feature,
        properties: {
          ...feature.properties,
          color: feature.properties ?
            (feature?.geometry?.type === 'Point') ?
              feature.properties['icon-color'] :
              (feature.geometry?.type === 'LineString') ?
                feature.properties.stroke :
                feature.properties.color
            : undefined
        }
      })) as Array<Feature>
  };

  if(geoJsonFromConverter.features.length === 0) {
    return {
      points: [],
      tracks: [],
      numberOfErrors: 1
    };
  } else {
    return geoJSONImporter(geoJsonForImporter);
  }
};

export default kmlImporter;
