import turfDistance from '@turf/distance';
import {Position} from 'geojson';


export const getAccumulatedProfileProperties = (coordinates?: Position[]) => {
  if (coordinates) {
    const startTimeInSec = coordinates.length > 0 && coordinates[0][3] !== undefined ? coordinates[0][3] : undefined;
    const endTimeInSec = coordinates.length > 0 && coordinates[coordinates.length - 1][3] !== undefined ? coordinates[coordinates.length - 1][3] : undefined;
    const elapsedTimeInSec = startTimeInSec !== undefined && endTimeInSec !== undefined && endTimeInSec > startTimeInSec ? endTimeInSec - startTimeInSec : undefined;
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
        time: elapsedTimeInSec
      });
  } else return undefined;
};
