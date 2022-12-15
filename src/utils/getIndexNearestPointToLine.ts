import {ScopePath} from '../types/commonTypes';
import turfNearestPointOnLine from '@turf/nearest-point-on-line';

export const getIndexNearestPointToLine = (track: ScopePath, point: GeoJSON.Position) => {
  if(track.geometry && point){
    return turfNearestPointOnLine(track.geometry, point).properties.index;
  } else return undefined;
};