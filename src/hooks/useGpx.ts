import {useEffect, useState} from 'react';

import {ScopePoint, ScopeTrack, UUID} from '../types/commonTypes';
import {useScopePoints, useScopeTracks} from './useStoredCollections';
import {
  createDirectory,
  dirExists,
  FolderType,
  removeDirectory,
  writeFile
} from '../utils/filesystem';
import {PersistenceStatus} from './usePersistenceData';
import {useGPXExport} from './exporters/useGPXExport';

type useGpxState = {
  data: string,
  tracks: ScopeTrack[],
  points: ScopePoint[]
}

interface useGpxOptions {
  scopeId: UUID,
  trackId: UUID,
  includeVisiblePoints?: boolean
}

export const useGpx = (
  options: useGpxOptions
) => {
  const {
    scopeId,
    trackId,
    includeVisiblePoints = false
  } = options;

  const gpx = useGPXExport(scopeId, trackId, includeVisiblePoints);
  const trackStore = useScopeTracks(scopeId);
  const pointStore = useScopePoints(scopeId);

  const tracks = trackStore.list();
  const points = pointStore.list();

  const tracksStatus = trackStore.status;
  const pointStatus = pointStore.status;

  const [state, setState] = useState<useGpxState|undefined>(undefined);
  const [path, setPath] = useState<string|undefined>(undefined);

  useEffect(() => {
    if (!state && gpx && tracksStatus === PersistenceStatus.READY && pointStatus === PersistenceStatus.READY) {
      setState({
        data: gpx,
        tracks,
        points
      });
    }
  }, [state, gpx, tracks, points, pointStatus, tracksStatus]);


  useEffect(() => {
    if (state) {
      const launch = async () => {
        if (await dirExists(scopeId, FolderType.Export)){
          await removeDirectory(scopeId, FolderType.Export);
        }
        const folder = await createDirectory(scopeId, FolderType.Export);

        if (folder){
          const filename = `${scopeId}.gpx`;
          const fileResult = await writeFile(state.data, folder + '/' + filename);
          if (fileResult) {
            setPath(fileResult.uri);
          }
        }
      };

      launch();
    }
  }, [state]);

  return path;
};