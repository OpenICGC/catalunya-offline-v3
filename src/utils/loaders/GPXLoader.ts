import {load} from '@loaders.gl/core';
import {GPXLoader as glGPXLoader} from '@loaders.gl/kml';
import {IGeodataLoader} from './types';

const GPXLoader: IGeodataLoader = {
  load: (url) => load(url, glGPXLoader)
};

export default GPXLoader;
