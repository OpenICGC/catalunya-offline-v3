import {Scope} from '../../types/commonTypes';
import Mustache from 'mustache';
import {useScopePoints, useScopeTracks} from '../useStoredCollections';
import kmlTemplate from './kmlTemplate.xml';

export const useKmlExport = (scope: Scope) => {
  const pointStore = useScopePoints(scope.id);
  const trackStore = useScopeTracks(scope.id);
  const scopePointList = pointStore.list();
  const scopeTrackList = trackStore.list();
    
  const formattedPoints = scopePointList.map(point => {
    if (point.geometry?.coordinates.length === 2) {
      return {
        ...point,
        properties: {
          ...point.properties,
          color: point.properties.color ? 'ff'+point.properties.color.slice(1,7) : 'ff'+scope.color.slice(1,7),
        },
        getCoordinates: () => {
          return point.geometry?.coordinates.toString();
        },
        getImages: () => point.properties.images.map(image => {
          const lastIndexOf = image.lastIndexOf('/');
          return image.substring(lastIndexOf + 1);
        })
      };
    } else {
      return {
        ...point,
        properties: {
          ...point.properties,
          color: point.properties.color && 'ff'+point.properties.color.slice(1,7)
        },
        getCoordinates: () => {
          return point.geometry?.coordinates.toString();
        },
        getImages: () => point.properties.images.map(image => {
          const lastIndexOf = image.lastIndexOf('/');
          return image.substring(lastIndexOf + 1);
        })
      };
    }
  }
  );
  
  const formattedTracks = scopeTrackList.map(track => {
    if (track.geometry?.coordinates.some(coord => coord.length === 2)) {
      return {
        ...track,
        properties:
          {
            ...track.properties,
            color: track.properties.color && 'ff' + track.properties.color.slice(1, 7)
          },
        getCoordinates: () => {
          return track.geometry?.coordinates.map(coord => coord.concat(0)).join(',');
        },
        getImages: () => track.properties.images.map(image => {
          const lastIndexOf = image.lastIndexOf('/');
          return image.substring(lastIndexOf + 1);
        })
      };
    } else if (track.geometry?.coordinates.some(coord => coord.length > 3)) {
      return {
        ...track,
        properties:
          {
            ...track.properties,
            color: track.properties.color && 'ff' + track.properties.color.slice(1, 7)
          },
        getCoordinates: () => {
          return track.geometry?.coordinates.map(coord => coord.slice(0,3)).join(',');
        },
        getImages: () => track.properties.images.map(image => {
          const lastIndexOf = image.lastIndexOf('/');
          return image.substring(lastIndexOf + 1);
        })
      };
    } else {
      return {
        ...track,
        properties:
          {
            ...track.properties,
            color: track.properties.color && 'ff' + track.properties.color.slice(1, 7)
          },
        getCoordinates: () => {
          return track.geometry?.coordinates.join(',');
        },
        getImages: () => track.properties.images.map(image => {
          const lastIndexOf = image.lastIndexOf('/');
          return image.substring(lastIndexOf + 1);
        })
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