import {useMemo} from 'react';
import {buildGPX, BaseBuilder} from 'gpx-builder';

import {UUID} from '../../types/commonTypes';
import {useScopePoints, useScopes, useScopeTracks} from '../useStoredCollections';

export const useGPXExport = (scopeId: UUID, trackId: UUID, includeVisiblePoints?: boolean) => {
  const {Point, Metadata, Track, Segment} = BaseBuilder.MODELS;

  const scope = useScopes().retrieve(scopeId);
  const track = useScopeTracks(scopeId).retrieve(trackId);
  const points = useScopePoints(scopeId).list();

  return useMemo(() => {
    if (scope !== undefined && track !== undefined && (points !== undefined || !includeVisiblePoints)) {
      const gpxBuilder = new BaseBuilder();

      // METADATA
      gpxBuilder.setMetadata(new Metadata(
        {
          name: scope.name
        }
      ));

      // WAYPOINTS
      if (includeVisiblePoints) {
        const gpxWayPoints = points
          ?.filter(point => point.properties.isVisible)
          .map(point =>
            new Point(point.geometry.coordinates[1], point.geometry.coordinates[0],
              {
                ele: point.geometry.coordinates[2] || undefined,
                time: new Date(point.properties.timestamp) || undefined, // already in milliseconds
                name: point.properties.name,
                desc: point.properties.description
              })
          );
        if (gpxWayPoints?.length) {
          gpxBuilder.setWayPoints(gpxWayPoints);
        }
      }

      // TRACK
      const gpxSegmentPoints = track?.geometry?.coordinates
        .map(coord => {
          if (coord[2] && coord[3]) {
            return new Point(coord[1], coord[0],
              {
                ele: coord[2],
                time: new Date(coord[3] * 1000) // from seconds to milliseconds
              });
          } else if (coord[2]) {
            return new Point(coord[1], coord[0],
              {
                ele: coord[2]
              });
          } else {
            return new Point(coord[1], coord[0]);
          }
        });

      if (gpxSegmentPoints?.length) {
        gpxBuilder.setTracks([new Track(
          [new Segment(gpxSegmentPoints)], {
            name: track?.properties.name,
            desc: track?.properties.description
          }
        )]);
      }

      return buildGPX(gpxBuilder.toObject());
    }
  }, [scope, track, points]);
};
