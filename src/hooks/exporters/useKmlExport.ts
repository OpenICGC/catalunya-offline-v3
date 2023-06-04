import {UUID} from '../../types/commonTypes';
import Mustache from 'mustache';
import {useScopePoints, useScopes, useScopeTracks} from '../usePersistedCollections';
import kmlTemplate from './template.kml';
import {getImageNameWithoutPath} from '../../utils/getImageNameWithoutPath';
import {getKmlColorFromHexaColor} from '../../utils/getKmlColorFromHexaColor';

export const useKmlExport = (scopeId: UUID) => {
  const scope = useScopes().retrieve(scopeId);
  const pointStore = useScopePoints(scopeId);
  const trackStore = useScopeTracks(scopeId);
  const scopePointList = pointStore.list();
  const scopeTrackList = trackStore.list();
    
  const formattedPoints = scopePointList?.map(point => {
    return {
      ...point,
      properties: {
        ...point.properties,
        color: point.properties.color ? getKmlColorFromHexaColor(point.properties.color) : getKmlColorFromHexaColor(scope?.color),
      },
      getCoordinates: () => {
        return point.geometry?.coordinates.toString();
      },
      getImages: () => point.properties.images.map(image => getImageNameWithoutPath(image))
    };
  });
  
  const formattedTracks = scopeTrackList?.map(track => {
    if (track.geometry?.coordinates.some(coord => coord.length === 2)) {
      return {
        ...track,
        properties:
          {
            ...track.properties,
            color: track.properties.color ? getKmlColorFromHexaColor(track.properties.color) : getKmlColorFromHexaColor(scope?.color),
          },
        getCoordinates: () => track.geometry?.coordinates.map(coord => coord.concat(0)).join(' '),
        getImages: () => track.properties.images.map(image => getImageNameWithoutPath(image))
      };
    } else if (track.geometry?.coordinates.some(coord => coord.length > 3)) {
      return {
        ...track,
        properties:
          {
            ...track.properties,
            color: track.properties.color ? getKmlColorFromHexaColor(track.properties.color) : getKmlColorFromHexaColor(scope?.color),
          },
        getCoordinates: () => track.geometry?.coordinates.map(coord => coord.slice(0,3)).join(' '),
        getImages: () => track.properties.images.map(image => getImageNameWithoutPath(image))
      };
    } else {
      return {
        ...track,
        properties:
          {
            ...track.properties,
            color: track.properties.color ? getKmlColorFromHexaColor(track.properties.color) : getKmlColorFromHexaColor(scope?.color),
          },
        getCoordinates: () => track.geometry?.coordinates.join(' '),
        getImages: () => track.properties.images.map(image => getImageNameWithoutPath(image))
      };
    }
  }
  );

  const data = {
    scope: scope,
    points: formattedPoints,
    tracks: formattedTracks
  };

  const kml = Mustache.render(kmlTemplate, data);
  return kml;
};