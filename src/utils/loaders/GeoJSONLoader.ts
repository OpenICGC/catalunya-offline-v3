import {load, JSONLoader} from '@loaders.gl/core';
import {IGeodataLoader} from './types';

const GeoJSONLoader: IGeodataLoader = {
  load: (url) => load(url, JSONLoader)
};

export default GeoJSONLoader;
