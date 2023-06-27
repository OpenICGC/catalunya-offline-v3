import {FC, useCallback, useEffect} from 'react';

import {CatOfflineError, UUID} from '../../types/commonTypes';
import {MAX_ALLOWED_SCOPE_IMPORT_FEATURES} from '../../config';

import useFilePicker, {FilePickerResult} from '../../hooks/useFilePicker';
import geoJSONScopeImporter from '../../utils/scopeImporters/geoJSONScopeImporter';
import gpxScopeImporter from '../../utils/scopeImporters/gpxScopeImporter';
import kmlScopeImporter from '../../utils/scopeImporters/kmlScopeImporter';
import {useScopePoints, useScopeTracks} from '../../hooks/usePersistedCollections';

import {ScopeImporter} from '../../utils/scopeImporters/types';
import {asDataUrl} from '../../utils/loaders/helpers';

type suppportedMimeType = 'application/geo+json' | 'application/vnd.google-earth.kml+xml' | 'application/gpx+xml';

const importers: Record<suppportedMimeType, ScopeImporter> = {
  'application/geo+json': geoJSONScopeImporter,
  'application/vnd.google-earth.kml+xml': kmlScopeImporter,
  'application/gpx+xml': gpxScopeImporter
};

export type ScopeImporterProps = {
  scopeId: UUID,
  onSuccess: () => void
  onError: (error: CatOfflineError) => void
}

const ScopeImporter: FC<ScopeImporterProps> = ({
  scopeId,
  onSuccess,
  onError
}) => {

  const pickedFile = useFilePicker(Object.keys(importers) as Array<suppportedMimeType>, onError);
  const trackStore = useScopeTracks(scopeId);
  const pointStore = useScopePoints(scopeId);

  const importData = useCallback(async (file: FilePickerResult) => {
    const mimeType = file.mimeType as suppportedMimeType;
    const importer = importers[mimeType];
    if (importer && (file.blob || file.data)) {
      const importResult =
        await importer(file.blob ?? asDataUrl(file.data as string, mimeType))
          .catch((reason) => {
            onError({
              code: reason.toString() || 'errors.import.read'
            });
          });
      if (importResult) {
        const {points, tracks, numberOfErrors} = importResult;
        const totalFeatures = points.length + tracks.length;
        if (totalFeatures > MAX_ALLOWED_SCOPE_IMPORT_FEATURES) {
          onError({
            code: 'errors.import.length',
            params: {maxFeatures: MAX_ALLOWED_SCOPE_IMPORT_FEATURES}
          });
        } else if (numberOfErrors) {
          onError({
            code: 'errors.import.someFeatures',
            params: {totalFeatures, numberOfErrors}
          });
        } else {
          await pointStore.create(points);
          await trackStore.create(tracks);
          onSuccess();
        }
      }
    } else {
      onError({code: 'errors.import.format'});
    }
  }, [onSuccess, onError, trackStore.create, pointStore.create]);

  useEffect(() => {
    if (pickedFile) {
      importData(pickedFile);
    }
  }, [pickedFile]);

  return null;
};

export default ScopeImporter;
