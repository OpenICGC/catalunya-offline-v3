import {useEffect, useState} from 'react';

import {ScopeFeature, ScopePoint, ScopeTrack, UUID} from '../types/commonTypes';
import {useScopePoints, useScopeTracks} from './useStoredCollections';
import {
  copyFilesToDir,
  createDirectory,
  dirExists,
  FolderType,
  generateZip,
  removeDirectory,
  writeFile
} from '../utils/filesystem';
import {PersistenceStatus} from './usePersistenceData';
import {useKmlExport} from './exporters/useKmlExport';
import {useGeoJSONExport} from './exporters/useGeoJSONExport';

type useZipState = {
  data: string,
  tracks: ScopeTrack[],
  points: ScopePoint[]
}

export enum ZipType {
  ZIP,
  KMZ
}

interface useZipOptions {
  type: ZipType,
  scopeId: UUID,
  trackId?: UUID,
  includeVisiblePoints?: boolean
}

export const useZip = (
  options: useZipOptions
) => {
  const {
    type = ZipType.ZIP,
    scopeId,
    trackId,
    includeVisiblePoints = false
  } = options;

  const geojson = useGeoJSONExport(scopeId, trackId, includeVisiblePoints);
  const kml = useKmlExport(scopeId);
  const trackStore = useScopeTracks(scopeId);
  const pointStore = useScopePoints(scopeId);

  const tracks = trackStore.list();
  const points = pointStore.list();

  const tracksStatus = trackStore.status;
  const pointStatus = pointStore.status;

  const [state, setState] = useState<useZipState|undefined>(undefined);
  const [path, setPath] = useState<string|undefined>(undefined);

  const getPhotosPaths = (features: ScopeFeature[]): string[] | undefined  =>
    features.flatMap(feature => feature.properties.images.map(image => image.replace('file://', '')));

  useEffect(() => {
    if (!state && geojson && kml && tracksStatus === PersistenceStatus.READY && pointStatus === PersistenceStatus.READY) {
      const data = type === ZipType.ZIP ?
        JSON.stringify(geojson) :
        kml;
      setState({
        data,
        tracks,
        points
      });
    }
  }, [state, geojson, kml, tracks, points, pointStatus, tracksStatus]);


  useEffect(() => {
    if (state) {
      const launch = async () => {
        if (await dirExists(scopeId, FolderType.Export)){
          await removeDirectory(scopeId, FolderType.Export);
        }
        const folder = await createDirectory(scopeId, FolderType.Export);

        if (folder){
          const trackPhotos = getPhotosPaths(state.tracks);
          const pointPhotos = getPhotosPaths(state.points);
          const filename = type === ZipType.ZIP ?
            `${scopeId}.geojson` : `${scopeId}.kml`;
          await writeFile(state.data, folder + '/' + filename);
          if (trackPhotos || pointPhotos) {
            const filesFolder = await createDirectory(scopeId + '/files', FolderType.Export);
            if (trackPhotos?.length && filesFolder) await copyFilesToDir(trackPhotos, filesFolder);
            if (pointPhotos?.length && filesFolder) await copyFilesToDir(pointPhotos, filesFolder);
          }
          const zipFilename = type === ZipType.ZIP ?
            `${scopeId}.zip` : `${scopeId}.kmz`;
          const finalZip = await generateZip(scopeId, zipFilename, FolderType.Export, FolderType.Export);
          if (finalZip) {
            setPath(finalZip);
          }
          await removeDirectory(scopeId, FolderType.Export);
        }
      };

      launch();
    }
  }, [state]);

  return path;
};