import {UUID} from '../../types/commonTypes';
import { buildGPX, BaseBuilder } from 'gpx-builder';
import {useScopePoints, useScopes, useScopeTracks} from '../useStoredCollections';
import {Segment} from 'gpx-builder/dist/builder/BaseBuilder/models';
import {useEffect, useState} from 'react';

export const useGPXExport = (scopeId: UUID, trackId: UUID, includeVisiblePoints?: boolean) => {
  const {Point, Metadata, Track} = BaseBuilder.MODELS;
  
  const [gpx, setGpx] = useState<string|undefined>(undefined);
  
  const scope = useScopes().retrieve(scopeId);
  const trackStore = useScopeTracks(scopeId);
  const pointStore = useScopePoints(scopeId);

  const scopeTrack = trackStore.retrieve(trackId);
  const scopePointList = pointStore.list();

  useEffect(() => {
    if (!gpx && scope && scopeTrack !== undefined && scopePointList !== undefined) {
      const meta = new Metadata(
        {
          name: scope.name
        }
      );

      if (includeVisiblePoints) {
        const visiblePointsToExport = scopePointList.filter(point => point.properties.isVisible);

        const trackWayPoints = scopeTrack && scopeTrack?.geometry?.coordinates.map(coord => {
          if (coord[2] && coord[3]) {
            return new Point(coord[1], coord[0],
              {
                ele: coord[2],
                time: new Date(coord[3] * 1000) // from seconds to milliseconds
              });
          } else if (coord[2]) {
            return new Point(coord[1], coord[0],
              {
                ele: coord[2],
              });
          } else {
            return new Point(coord[1], coord[0]);
          }
        });

        const points = visiblePointsToExport.map(point =>
          new Point(point.geometry.coordinates[1], point.geometry.coordinates[0],
            {
              ele: point.geometry.coordinates[2] || undefined,
              time: new Date(point.properties.timestamp) || undefined, // already in milliseconds
              name: point.properties.name,
              desc: point.properties.description
            }));

        const segmentLine = trackWayPoints && new Segment(trackWayPoints);

        const trackLine = segmentLine && new Track(
          [segmentLine], {
            name: scopeTrack?.properties.name,
            desc: scopeTrack?.properties.description
          }
        );

        const gpx = new BaseBuilder();
        gpx.setMetadata(meta);
        gpx.setWayPoints(points);
        trackLine && gpx.setTracks([trackLine]);

        return setGpx(buildGPX(gpx.toObject()));

      } else {

        const trackWayPoints = scopeTrack?.geometry?.coordinates.map(coord => {
          if (coord[2] && coord[3]) {
            return new Point(coord[1], coord[0],
              {
                ele: coord[2],
                time: new Date(coord[3] * 1000) // from seconds to milliseconds
              });
          } else if (coord[2]) {
            return new Point(coord[1], coord[0],
              {
                ele: coord[2],
              });
          } else {
            return new Point(coord[1], coord[0]);
          }
        });

        const segmentLine = trackWayPoints && new Segment(trackWayPoints);

        const trackLine = segmentLine && new Track(
          [segmentLine], {
            name: scopeTrack?.properties.name,
            desc: scopeTrack?.properties.description
          }
        );

        const gpx = new BaseBuilder();
        gpx.setMetadata(meta);
        trackLine && gpx.setTracks([trackLine]);

        return setGpx(buildGPX(gpx.toObject()));
      }
    }
  }, [scope, scopeTrack, scopePointList]);

  return gpx;
  
};