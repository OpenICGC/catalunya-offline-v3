import {ScopeFeature, UUID} from '../../types/commonTypes';
import {useScopePoints, useScopeTracks} from '../useStoredCollections';
import {useEffect, useState} from 'react';
import {PersistenceStatus} from '../usePersistenceData';
import {getImageNameWithoutPath} from '../../utils/getImageNameWithoutPath';
import {Feature, FeatureCollection} from 'geojson';

const changeImagePaths = (features: Array<ScopeFeature>): Array<ScopeFeature> => features
  .map(feature => ({
    ...feature,
    properties: {
      ...feature.properties,
      images: feature.properties.images
        .map(image => 'files/' + getImageNameWithoutPath(image))
    }
  }));
export const useGeoJSONExport = (scopeId: UUID, trackId?: UUID, includeVisiblePoints?: boolean) => {
  
  const [geojson, setGeojson] = useState<FeatureCollection|undefined>(undefined);
  
  const trackStore = useScopeTracks(scopeId);
  const pointStore = useScopePoints(scopeId);
  
  const tracks = trackStore.list();
  const points = pointStore.list();
  
  const tracksStatus = trackStore.status;
  const pointStatus = pointStore.status;
  
  useEffect(() => {
    if (!geojson && tracksStatus === PersistenceStatus.READY && pointStatus === PersistenceStatus.READY) {
      const tracksWithValidImagePaths = changeImagePaths(tracks);
      const pointsWithValidImagePaths = changeImagePaths(points);

      if ( trackId ) {
        const track = tracksWithValidImagePaths
          .filter(track => track.geometry)
          .find(track => track.id === trackId);
        
        if (track) {
          if (includeVisiblePoints) {
            const visiblePointsToExport = pointsWithValidImagePaths.filter(point => point.properties.isVisible);
            setGeojson({
              'type': 'FeatureCollection',
              'features': [track as Feature, ...visiblePointsToExport as Array<Feature>]
            });
          } else {
            setGeojson({
              'type': 'FeatureCollection',
              'features': [track as Feature]
            });
          } 
        }          
      } else { //Export all Scope
        const allTrack = tracksWithValidImagePaths
          .filter(track => track.geometry);
        setGeojson({
          'type': 'FeatureCollection',
          'features': [...allTrack as Array<Feature>, ...pointsWithValidImagePaths as Array<Feature>]
        });
      }
    }
  }, [tracks, points, tracksStatus, pointStatus]);
  
  return geojson;
};