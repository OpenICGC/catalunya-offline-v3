import {FC, useCallback, useEffect} from 'react';
import {Error, UUID} from '../../../types/commonTypes';
import useFilePicker, {FilePickerResult} from '../../../hooks/useFilePicker';
import geoJSONScopeImporter from '../../../utils/scopeImporters/geoJSONScopeImporter';
import gpxScopeImporter from '../../../utils/scopeImporters/gpxScopeImporter';
import kmlScopeImporter from '../../../utils/scopeImporters/kmlScopeImporter';
import {useScopePoints, useScopeTracks} from '../../../hooks/usePersistedCollections';
import {MAX_ALLOWED_IMPORT_FEATURES} from '../../../config';
import {useTranslation} from 'react-i18next';
import {ScopeImporter} from '../../../utils/scopeImporters/types';
import {asDataUrl} from '../../../utils/loaders/helpers';

type suppportedMimeType = 'application/geo+json' | 'application/vnd.google-earth.kml+xml' | 'application/gpx+xml';

const importers: Record<suppportedMimeType, ScopeImporter> = {
  'application/geo+json': geoJSONScopeImporter,
  'application/vnd.google-earth.kml+xml': kmlScopeImporter,
  'application/gpx+xml': gpxScopeImporter
};

export type HandleImportProps = {
  scopeId: UUID,
  onSuccess: () => void
  onError: (error: Error) => void
}

const HandleImport: FC<HandleImportProps> = ({
  scopeId,
  onSuccess,
  onError
}) => {

  const {t} = useTranslation();
  const pickedFile = useFilePicker(Object.keys(importers) as Array<suppportedMimeType>, onError);
  const trackStore = useScopeTracks(scopeId);
  const pointStore = useScopePoints(scopeId);

  const importData = useCallback(async (file: FilePickerResult) => {
    const mimeType = file.mimeType as suppportedMimeType;
    const importer = importers[mimeType];
    if (importer && file.data) {
      const {points, tracks, numberOfErrors} = await importer(asDataUrl(file.data, mimeType));
      const totalFeatures = points.length + tracks.length;
      if (totalFeatures > MAX_ALLOWED_IMPORT_FEATURES) {
        onError({name: 'errors.import.length', message: t('errors.import.length', {max_features: MAX_ALLOWED_IMPORT_FEATURES})});
      } else if (numberOfErrors) {
        onError({
          name: 'errors.import.unmanaged_errors',
          message: t('errors.import.unmanaged_errors', {totalFeatures, numberOfErrors})
        });
      } else {
        await pointStore.create(points);
        await trackStore.create(tracks);
        onSuccess();
      }
    } else {
      onError({name: 'errors.import.format', message: t('errors.import.format')});
    }
  }, [onSuccess, onError, trackStore.create, pointStore.create]);

  useEffect(() => {
    if (pickedFile) {
      importData(pickedFile);
    }
  }, [pickedFile]);

  return null;
};

export default HandleImport;
