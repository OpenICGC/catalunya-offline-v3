import {Schema, ScopeFeature, UUID} from '../../types/commonTypes';
import {useScopePoints, useScopes, useScopeTracks} from '../usePersistedCollections';
import {useEffect, useState} from 'react';
import {getImageNameWithoutPath} from '../../utils/getImageNameWithoutPath';
import {Feature, FeatureCollection} from 'geojson';
import {useTranslation} from 'react-i18next';

const formatFeatures = (features: Array<ScopeFeature>, schema: Schema | undefined, language: string): Array<ScopeFeature> => features
  .map(feature => ({
    type: feature.type,
    id: feature.id,
    geometry: feature.geometry,
    properties: {
      ...feature.properties,
      ...schema?.reduce((props, schema) => ({...props, [schema.name]: feature.schemaValues ? feature.schemaValues[schema.id] : ''}), {} as Record<string, string>),
      formattedDate: new Date(feature.properties.timestamp).toLocaleString(language),
      images: feature.properties.images.map(image => 'files/' + getImageNameWithoutPath(image))
    }
  }));
export const useGeoJSONExport = (scopeId: UUID, trackId?: UUID, includeVisiblePoints?: boolean) => {
  const {i18n} = useTranslation();

  const [geojson, setGeojson] = useState<FeatureCollection|undefined>(undefined);

  const scopeStore = useScopes();
  const trackStore = useScopeTracks(scopeId);
  const pointStore = useScopePoints(scopeId);

  const scope = scopeStore.retrieve(scopeId);
  const tracks = trackStore.list();
  const points = pointStore.list();

  useEffect(() => {
    if (scope !== undefined && tracks !== undefined && points !== undefined) {
      const formattedTracks = formatFeatures(tracks, scope.schema?.filter((s => s.appliesToTracks)), i18n.language);
      const formattedPoints = formatFeatures(points, scope.schema?.filter((s => s.appliesToPoints)), i18n.language);

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
  }, [scope, points, tracks]);
  
  return geojson;
};
