import {load, JSONLoader} from '@loaders.gl/core';
import {IGeodataLoader} from './types';
import {FeatureCollection} from 'geojson';

const GeoJSONLoader: IGeodataLoader = {
  load: async (url) => {
    const result = await load(url, JSONLoader);
    return result as FeatureCollection;
  }
};

export default GeoJSONLoader;
