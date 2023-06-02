import * as converter from '@tmcw/togeojson';
import {DOMParser} from 'xmldom';
import geoJSONScopeImporter, {ScopeImportResults} from './geoJSONScopeImporter';
import GeoJSON from 'geojson';

const gpxScopeImporter: (data: string) => Promise<ScopeImportResults> = async(data) => {
  const gpx = new DOMParser().parseFromString(data, 'application/xml');
  const geoJsonFromGpx = converter.gpx(gpx);
  const geoJsonFormatted = {
    ...geoJsonFromGpx,
    features: geoJsonFromGpx.features.map(feature => {
      if (feature.geometry.type === 'Point') {
        return {
          ...feature,
          properties: {
            ...feature.properties,
            description: feature.properties ? feature.properties.desc ? feature.properties.desc : feature.properties.cmt : '',
          },
          geometry: {
            ...feature.geometry,
            coordinates:  feature.geometry.coordinates
          }
        }; 
      } else if (feature.geometry.type === 'LineString') {
        if(feature?.properties?.coordinateProperties.times){
          const arrayOfTimestamps = feature.properties.coordinateProperties.times.map((time: string | number | Date) => Math.round(new Date(time).getTime() / 1000));  // timestamp in seconds as fourth coord
          const arrayOfCoordinates = feature?.geometry?.coordinates;
    
          const coordinatesWithTimestamp = arrayOfCoordinates.map((coord: GeoJSON.Position, i: number) => {
            if(coord.length === 2) {
              return coord.concat(0).concat(arrayOfTimestamps[i]);
            } else {
              return coord.concat(arrayOfTimestamps[i]);
            }
          });
          return {
            ...feature,
            properties: {
              ...feature.properties,
              description: feature.properties ? feature.properties.desc ? feature.properties.desc : feature.properties.cmt : '',
            },
            geometry: {
              ...feature.geometry,
              coordinates:  coordinatesWithTimestamp
            }
          };
        } else {
          return {
            ...feature,
            properties: {
              ...feature.properties,
              description: feature.properties ? feature.properties.desc ? feature.properties.desc : feature.properties.cmt : '',
            },
            geometry: {
              ...feature.geometry,
              coordinates:  feature.geometry.coordinates
            }
          };
        }
      } else {
        return {
          ...feature
        };
      }
    })
  };

  if(geoJsonFromGpx.features.length === 0) {
    console.log('Error importing GPX: No features found');
    return {
      points: [],
      tracks: [],
      numberOfErrors: 1
    };
  } else {
    return geoJSONScopeImporter(geoJsonFormatted);
  }
};

export default gpxScopeImporter;
