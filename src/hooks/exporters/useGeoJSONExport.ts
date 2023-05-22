import {ScopeFeature, UUID} from '../../types/commonTypes';
import {useScopePoints, useScopeTracks} from '../usePersistedCollections';
import {useEffect, useState} from 'react';
import {getImageNameWithoutPath} from '../../utils/getImageNameWithoutPath';
import {Feature, FeatureCollection} from 'geojson';
import {useTranslation} from 'react-i18next';

const formatFeatures = (features: Array<ScopeFeature>, language: string): Array<ScopeFeature> => features
  .map(feature => ({
    ...feature,
    properties: {
      ...feature.properties,
      formattedDate: new Date(feature.properties.timestamp).toLocaleString(language),
      images: feature.properties.images.map(image => 'files/' + getImageNameWithoutPath(image))
    }
  }));
export const useGeoJSONExport = (scopeId: UUID, trackId?: UUID, includeVisiblePoints?: boolean) => {
  const {i18n} = useTranslation();

  const [geojson, setGeojson] = useState<FeatureCollection|undefined>(undefined);
  
  const trackStore = useScopeTracks(scopeId);
  const pointStore = useScopePoints(scopeId);
  
  const tracks = trackStore.list();
  const points = pointStore.list();

  useEffect(() => {
    if (tracks !== undefined && points !== undefined) {
      const formattedTracks = formatFeatures(tracks, i18n.language);
      const formattedPoints = formatFeatures(points, i18n.language);

      if ( trackId ) {
        const track = formattedTracks
          .filter(track => track.geometry)
          .find(track => track.id === trackId);
        
        if (track) {
          if (includeVisiblePoints) {
            const visiblePointsToExport = formattedPoints.filter(point => point.properties.isVisible);
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
        const allTrack = formattedTracks
          .filter(track => track.geometry);
        setGeojson({
          'type': 'FeatureCollection',
          'features': [...allTrack as Array<Feature>, ...formattedPoints as Array<Feature>]
        });
      }
    }
  }, [tracks, points]);
  
  return geojson;
};
