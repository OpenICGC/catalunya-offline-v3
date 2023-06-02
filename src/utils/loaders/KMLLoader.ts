import {load} from '@loaders.gl/core';
import {KMLLoader as glKMLLoader} from '@loaders.gl/kml';
import {IGeodataLoader} from './GeodataLoader';

const KMLLoader: IGeodataLoader = {
  load: (url) => load(url, glKMLLoader)
};

export default KMLLoader;
