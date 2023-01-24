import {UUID} from '../types/commonTypes';
import {useScopePoints, useScopeTracks} from './useStoredCollections';
export const useGeoJSONExport = (scopeId: UUID, trackId?: UUID, includeVisiblePoints?: boolean) => {
  const pointStore = useScopePoints(scopeId);
  const trackStore = useScopeTracks(scopeId);

  const scopePointList = pointStore.list();
  const scopeTrackList = trackStore.list();

  const scopeTrack = trackId ? trackStore.retrieve(trackId) : undefined;
  
  //EXPORT SCOPE
  const allPointsToExport = scopePointList.map(point => {
    return {
      geometry: point.geometry,
      properties: point.properties,
      type: point.type
    };
  });
  const allTracksToExport = scopeTrackList.map(track => {
    return {
      geometry: track.geometry,
      properties: track.properties,
      type: track.type
    };
  });

  const scopeToExport = [...allPointsToExport, ...allTracksToExport];
    
  //EXPORT TRACK & VISIBLE POINTS (trackId === true)
  const trackToExport = [{
    geometry: scopeTrack && scopeTrack.geometry,
    properties: scopeTrack && scopeTrack.properties,
    type: scopeTrack && scopeTrack.type
  }];
  const visiblePointsToExport = allPointsToExport.filter(point => point.properties.isVisible);

  const trackWithVisiblePointsToExport = visiblePointsToExport ? [...trackToExport, ...visiblePointsToExport] : undefined;

  return {
    'type': 'FeatureCollection',
    'features': trackId ?  includeVisiblePoints ? trackWithVisiblePointsToExport : trackToExport : scopeToExport,
  };
};