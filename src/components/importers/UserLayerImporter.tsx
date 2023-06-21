import {FC, useCallback, useEffect} from 'react';
import {useTranslation} from 'react-i18next';

import {v4 as uuid} from 'uuid';

import {Error, UserLayer} from '../../types/commonTypes';
import {MAX_ALLOWED_IMPORT_FEATURES} from '../../config';

import useFilePicker, {FilePickerResult} from '../../hooks/useFilePicker';
import {asDataUrl} from '../../utils/loaders/helpers';
import GeoJSONLoader from '../../utils/loaders/GeoJSONLoader';
import GPXLoader from '../../utils/loaders/GPXLoader';
import ShpZipLoader from '../../utils/loaders/ShpZipLoader';
import {IGeodataLoader} from '../../utils/loaders/types';
import useColorRamp from '@geomatico/geocomponents/hooks/useColorRamp';
import useColorPalette from '../../hooks/settings/useColorPalette';
import {useUserLayers} from '../../hooks/usePersistedCollections';

type suppportedMimeType = 'application/geo+json' | 'application/gpx+xml' | 'application/zip'; //, 'text/csv'

const loaders: Record<suppportedMimeType, IGeodataLoader> = {
  'application/geo+json': GeoJSONLoader,
  'application/gpx+xml': GPXLoader,
  'application/zip': ShpZipLoader
};

export type UserLayerImporter = {
  onSuccess: () => void
  onError: (error: Error) => void
}

const UserLayerImporter: FC<UserLayerImporter> = ({onSuccess, onError}) => {
  const {t} = useTranslation();
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
          .catch(() => {
            onError({
              name: 'errors.import.read',
              message:  t('errors.import.read')
            });
          });
      if (data) {
        if (data.features.length > MAX_ALLOWED_IMPORT_FEATURES) {
          onError({
            name: 'errors.import.length',
            message: t('errors.import.length', {max_features: MAX_ALLOWED_IMPORT_FEATURES})
          });
        } else {
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
      }
    } else {
      onError({name: 'errors.import.format', message: t('errors.import.format')});
    }
  }, [onSuccess, onError, userLayersStore.list, userLayersStore.create]);

  useEffect(() => {
    if (pickedFile) {
      importData(pickedFile);
    }
  }, [pickedFile]);

  return null;
};

export default UserLayerImporter;
