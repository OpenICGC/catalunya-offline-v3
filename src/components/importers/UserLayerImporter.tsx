import {FC, useCallback, useEffect} from 'react';

import {v4 as uuid} from 'uuid';

import {CatOfflineError, UserLayer} from '../../types/commonTypes';

import useFilePicker, {FilePickerResult} from '../../hooks/useFilePicker';
import {asDataUrl} from '../../utils/loaders/helpers';
import CSVLoader from '../../utils/loaders/CSVLoader';
import GeoJSONLoader from '../../utils/loaders/GeoJSONLoader';
import GPXLoader from '../../utils/loaders/GPXLoader';
import ShpZipLoader from '../../utils/loaders/ShpZipLoader';
import {IGeodataLoader} from '../../utils/loaders/types';
import useColorRamp from '@geomatico/geocomponents/hooks/useColorRamp';
import useColorPalette from '../../hooks/settings/useColorPalette';
import {useUserLayers} from '../../hooks/usePersistedCollections';

type suppportedMimeType = 'application/geo+json' | 'application/gpx+xml' | 'application/zip' | 'text/csv';

const loaders: Record<suppportedMimeType, IGeodataLoader> = {
  'application/geo+json': GeoJSONLoader,
  'application/gpx+xml': GPXLoader,
  'application/zip': ShpZipLoader,
  'text/csv': CSVLoader
};

export type UserLayerImporter = {
  availableSpace: number,
  onSuccess: () => void
  onError: (error: CatOfflineError) => void
}

const UserLayerImporter: FC<UserLayerImporter> = ({availableSpace, onSuccess, onError}) => {
  const pickedFile = useFilePicker(Object.keys(loaders) as Array<suppportedMimeType>, onError);
  const [colorPalette] = useColorPalette();
  const {hexColors: palette} = useColorRamp(colorPalette);
  const userLayersStore = useUserLayers();

  const importData = useCallback(async (file: FilePickerResult) => {
    const mimeType = file.mimeType as suppportedMimeType;
    const loader = loaders[mimeType];
    if (loader && (file.blob || file.data)) {
      const data =
        await loader.load(file.blob ?? asDataUrl(file.data as string, mimeType))
          .catch((reason) => {
            console.log('reason', reason);
            onError({
              code: reason.toString() || 'errors.import.read'
            });
          });
      if (data) {
        if (availableSpace < JSON.stringify(data).length) {
          onError({
            code: 'errors.import.noSpaceAvailable'
          });
          return;
        }
        const numLayers = userLayersStore.list()?.length ?? 0;
        const userLayer: UserLayer = {
          id: uuid(),
          name: file.name,
          color: palette[numLayers % palette.length],
          isVisible: true,
          data: data
        };
        await userLayersStore.create(userLayer);
        onSuccess();
      }
    } else {
      onError({code: 'errors.import.format'});
    }
  }, [availableSpace, onSuccess, onError, userLayersStore.list, userLayersStore.create]);

  useEffect(() => {
    if (pickedFile) {
      importData(pickedFile);
    }
  }, [pickedFile]);

  return null;
};

export default UserLayerImporter;
