import {load} from '@loaders.gl/core';
import {KMLLoader as glKMLLoader} from '@loaders.gl/kml';
import {IGeodataLoader} from './types';

const KMLLoader: IGeodataLoader = {
  load: async (url) => {
    const result = await load(url, glKMLLoader);
    if (result.shape === 'geojson-table') {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {shape, ...json} = result;
      return json;
    } else {
      return Promise.reject('errors.import.read');
    }
  }
};

export default KMLLoader;
