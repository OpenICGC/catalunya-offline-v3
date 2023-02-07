import {v4 as uuidv4} from 'uuid';
import {validate as uuidValidate, version as uuidVersion} from 'uuid';
import {ScopePoint, ScopeTrack} from '../../types/commonTypes';
import GeoJSON from 'geojson';

interface ScopeImportResults {
  points: Array<ScopePoint>,
  tracks: Array<ScopeTrack>,
  numberOfErrors: number
}

export const GeoJSONImport = (data: GeoJSON.FeatureCollection) => {
  const hexColorRegex = /^#([0-9a-f]{3}){1,2}$/i;
  const objImport: ScopeImportResults = {
    points: [],
    tracks: [],
    numberOfErrors: 0
  };
  data.features.map(feature => {
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
      objImport.numberOfErrors++;
    }
    return objImport;
  });
  return objImport;
};
