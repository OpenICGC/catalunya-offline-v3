import {load} from '@loaders.gl/core';
import {CSVLoader as glCSVLoader} from '@loaders.gl/csv';
import {IGeodataLoader} from './types';

const asCoord = (str: string) => parseFloat(str.replace(',', '.'));

const CSVLoader: IGeodataLoader = {
  load: (url) => load(url, glCSVLoader).then(result => {
    if (result.shape !== 'object-row-table') {
      return Promise.reject('errors.import.read');
    } else {
      const {data} = result;
      if (!data?.length) {
        return Promise.reject('errors.CSVLoader.noData');
      }
      if (!data[0].lat || !data[0].lon) {
        return Promise.reject('errors.CSVLoader.missingColumns');
      }
      return {
        type: 'FeatureCollection',
        features: data.map((row: Record<string, string>) => {
          const {lat, lon, ...properties} = row;
          return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [asCoord(lon), asCoord(lat)]
            },
            properties
          };
        })
      };
    }

  })
};

export default CSVLoader;
