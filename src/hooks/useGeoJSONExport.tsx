import {UUID} from '../types/commonTypes';
import {useScopePoints, useScopeTracks} from './useStoredCollections';
export const useGeoJSONExport = (scopeId: UUID, trackId?: UUID, includeVisiblePoints?: boolean) => {
    
  if ( trackId ) {
    if (includeVisiblePoints) { //Export Track and visiblePoints
      const trackStore = useScopeTracks(scopeId);
      const scopeTrack = trackStore.retrieve(trackId);
      const pointStore = useScopePoints(scopeId);
      const scopePointList = pointStore.list();
      const visiblePointsToExport = scopePointList.filter(point => point.properties.isVisible);

      return {
        'type': 'FeatureCollection',
        'features': scopeTrack && [...[scopeTrack], ...visiblePointsToExport]
      };
      
    } else { //Export Track
      const trackStore = useScopeTracks(scopeId);

      return {
        'type': 'FeatureCollection',
        'features': [trackStore.retrieve(trackId)]
      };
    }
      
  } else { //Export all Scope
    const pointStore = useScopePoints(scopeId);
    const trackStore = useScopeTracks(scopeId);
    const scopePointList = pointStore.list();
    const scopeTrackList = trackStore.list();

    return {
      'type': 'FeatureCollection',
      'features': [...scopePointList, ...scopeTrackList]
    };
  }
};