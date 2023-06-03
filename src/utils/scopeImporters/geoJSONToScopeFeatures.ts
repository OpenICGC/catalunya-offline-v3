import GeoJSON from 'geojson';
import {ScopeImporterResult} from './types';
import {v4 as uuidv4, validate as uuidValidate, version as uuidVersion} from 'uuid';
import {ScopePoint, ScopeTrack} from '../../types/commonTypes';

const geoJSONToScopeFeatures = (featureCollection: GeoJSON.FeatureCollection): ScopeImporterResult => {
  const hexColorRegex = /^#([0-9a-f]{3}){1,2}$/i;
  const objImport: ScopeImporterResult = {
    points: [],
    tracks: [],
    numberOfErrors: 0
  };

  featureCollection.features.map(feature => {
    if (feature.geometry.type === 'Point') {
      const featureId = uuidv4();
      const pointImport: ScopePoint = {
        type: 'Feature',
        id: (typeof feature.id === 'string') && uuidVersion(feature.id) === 4 && uuidValidate(feature.id) ? feature.id : featureId,
        properties: {
          name: feature.properties && (typeof feature.properties.name === 'string') ? feature.properties.name : feature.id ? `Point ${feature.id}` : `Point ${featureId}`,
          color: feature.properties && hexColorRegex.test(feature.properties.color) ? feature.properties.color : undefined,
          timestamp: feature.properties && (typeof feature.properties.timestamp === 'number') ? feature.properties.timestamp : Date.now(),
          description: feature.properties && (typeof feature?.properties.description === 'string') ? feature.properties.description : '',
          images: [],
          isVisible: feature.properties && (typeof feature.properties.isVisible === 'boolean') ? feature.properties.isVisible : true
        },
        geometry: feature.geometry
      };
      objImport.points.push(pointImport);
    } else if (feature.geometry.type === 'LineString') {
      const featureId = uuidv4();
      const trackImport: ScopeTrack = {
        type: 'Feature',
        id: (typeof feature.id === 'string') && uuidVersion(feature.id) === 4 && uuidValidate(feature.id) ? feature.id : featureId,
        properties: {
          name: feature.properties && (typeof feature.properties.name === 'string') ? feature.properties.name : `Track ${feature.id}` || `Track ${featureId}`,
          color: feature.properties && hexColorRegex.test(feature.properties.color) ? feature.properties.color : undefined,
          timestamp: feature.properties && (typeof feature.properties.timestamp === 'number') ? feature.properties.timestamp : Date.now(),
          description: feature.properties && (typeof feature.properties.description === 'string') ? feature.properties.description : '',
          images: [],
          isVisible: feature.properties && (typeof feature.properties.isVisible === 'boolean') ? feature.properties.isVisible : true
        },
        geometry: feature.geometry
      };
      objImport.tracks.push(trackImport);
    } else {
      console.log(`Error importing GeoJSON: Geometry type ${feature.geometry.type} not supported.`);
      objImport.numberOfErrors++;
    }
    return objImport;
  });
  return objImport;
};

export default geoJSONToScopeFeatures;
