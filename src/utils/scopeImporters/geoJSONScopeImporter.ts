import GeoJSONLoader from '../loaders/GeoJSONLoader';
import {ScopeImporter} from './types';
import {dataUrl} from '../loaders/types';
import geoJSONToScopeFeatures from './geoJSONToScopeFeatures';

const geoJSONScopeImporter: ScopeImporter = async (data: dataUrl | Blob) => {
  const featureCollection = await GeoJSONLoader.load(data);
  return geoJSONToScopeFeatures(featureCollection);
};

export default geoJSONScopeImporter;
