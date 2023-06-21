import {load} from '@loaders.gl/core';
import {CSVLoader as glCSVLoader} from '@loaders.gl/csv';
import {IGeodataLoader} from './types';

const asCoord = (str: string) => parseFloat(str.replace(',', '.'));

const CSVLoader: IGeodataLoader = {
  load: (url) => load(url, glCSVLoader).then(rows => {
    if (!rows?.length) {
      return Promise.reject(Error('CSV is empty'));
    }
    if (!rows[0].lat || !rows[0].lon) {
      return Promise.reject(Error('CSV: "lat" and a "lon" columns are mandatory'));
    }
    return {
      type: 'FeatureCollection',
      features: rows.map((row: Record<string, string>) => {
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
  })
};

export default CSVLoader;
