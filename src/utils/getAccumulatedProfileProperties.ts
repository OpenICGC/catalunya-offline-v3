import turfDistance from '@turf/distance';
import {Position} from 'geojson';


export const getAccumulatedProfileProperties = (coordinates?: Position[]) => {
  if (coordinates) {
    return coordinates.reduce(
      (accum, actualPosition, i, coordinates) => {
        if (i > 0) {
          const prevPosition = coordinates[i - 1];
          const prevHeight = prevPosition[2];
          const actualHeight = actualPosition[2];
          accum.distance += turfDistance(prevPosition, actualPosition, {units: 'meters'});
          if (actualHeight !== undefined && prevHeight !== undefined) {
            const heightDiff = actualHeight - prevHeight;
            if (heightDiff > 0) {
              accum.ascent += heightDiff;
            } else {
              accum.descent += heightDiff;
            }
          }
        }
        return accum;
      }, {
        ascent: 0,
        descent: 0,
        distance: 0,
        time: coordinates.length > 0 && coordinates[coordinates.length - 1][3] ? coordinates[coordinates.length - 1][3] : undefined
      });
  } else return undefined;
};
