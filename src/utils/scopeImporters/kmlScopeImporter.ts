import {Feature, FeatureCollection} from 'geojson';
import KMLLoader from '../loaders/KMLLoader';
import {ScopeImporter} from './types';
import {base64string} from '../loaders/types';
import geoJSONToScopeFeatures from './geoJSONToScopeFeatures';

const kmlScopeImporter: ScopeImporter = async (data: base64string | Blob) => {
  const geoJsonFromConverter = await KMLLoader.load(data);
  const geoJsonForImporter: FeatureCollection = {
    ...geoJsonFromConverter,
    features: geoJsonFromConverter.features
      .filter(feature => feature.geometry !== null)
      .map(feature => ({
        ...feature,
        properties: {
          ...feature.properties,
          description: '',  // TODO: Reinstaurate description?
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
    console.log('Error importing KML: No features found');
    return {
      points: [],
      tracks: [],
      numberOfErrors: 1
    };
  } else {
    return geoJSONToScopeFeatures(geoJsonForImporter);
  }
};

export default kmlScopeImporter;
