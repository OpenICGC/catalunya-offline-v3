import {Scope, UUID} from '../types/commonTypes';
import { buildGPX, BaseBuilder } from 'gpx-builder';
import {useScopePoints, useScopeTracks} from './useStoredCollections';
export const useGPXExport = (scope: Scope, trackId: UUID, includeVisiblePoints?: boolean) => {
  const {Point, Metadata, Route, Link} = BaseBuilder.MODELS;

  const meta = new Metadata(
    {
      name: scope.name,
      link: new Link('https://www.icgc.cat/ca/')
    }
  );

  const trackStore = useScopeTracks(scope.id);
  const scopeTrack = trackStore.retrieve(trackId);

  if (includeVisiblePoints) {

    const pointStore = useScopePoints(scope.id);
    const scopePointList = pointStore.list();
    const visiblePointsToExport = scopePointList.filter(point => point.properties.isVisible);

    const trackWayPoints = scopeTrack?.geometry?.coordinates.map(coord => {
      if(coord[2] && coord[3]){
        return new Point(coord[1], coord[0],
          {
            ele: coord[2],
            time: new Date(coord[3])
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
          time: new Date(point.properties.timestamp) || undefined,
          name: point.properties.name,
          cmt: point.properties.description
        }));
    
    const trackLine = [
      new Route(
        {
          name: scopeTrack?.properties.name,
          cmt: scopeTrack?.properties.description,
          rtept: trackWayPoints
        }
      )
    ];

    const gpx = new BaseBuilder();
    gpx.setMetadata(meta);
    gpx.setWayPoints(points);
    gpx.setRoutes(trackLine);

    return buildGPX(gpx.toObject());

  } else {

    const trackWayPoints = scopeTrack?.geometry?.coordinates.map(coord => {
      if(coord[2] && coord[3]){
        return new Point(coord[1], coord[0],
          {
            ele: coord[2],
            time: new Date(coord[3])
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

    const trackLine = [
      new Route(
        {
          name: scopeTrack?.properties.name,
          cmt: scopeTrack?.properties.description,
          rtept: trackWayPoints
        }
      )
    ];

    const gpx = new BaseBuilder();
    gpx.setMetadata(meta);
    gpx.setRoutes(trackLine);

    return buildGPX(gpx.toObject());

  }
};