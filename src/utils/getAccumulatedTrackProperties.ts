import {ScopeTrack} from '../types/commonTypes';
import turfDistance from '@turf/distance';

export const getAccumulatedTrackProperties = (track: ScopeTrack) => {
  const coords = track.geometry?.coordinates;
  if(coords){
    return coords.reduce(
      (accum, actualPosition, i, coordinates) => {
        if(i > 0){
          const [prevLong, prevLat, prevHeight] = coordinates[i-1];
          const [actualLong, actualLat, actualHeight] = coordinates[i];
          if(actualHeight !== undefined && prevHeight !== undefined){
            const heightDiff = actualHeight - prevHeight;
            accum.distance += turfDistance(coords[i-1], coords[1], {units:'meters'});
            if(heightDiff > 0){
              accum.ascent += heightDiff;
            } else {
              accum.descent += heightDiff;
            }
          }
        }
        return accum;
      }, { ascent: 0, descent: 0, distance: 0, time: coords.length !== 0 ? coords[coords.length-1][3] : 0 });
  } else return undefined;
};
