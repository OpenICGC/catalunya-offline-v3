import {FC, useCallback, useEffect} from 'react';
import {Error, UUID} from '../../../types/commonTypes';
import useFilePicker from '../../../hooks/useFilePicker';
import geoJSONScopeImporter, {ScopeImportResults} from '../../../utils/scopeImporters/geoJSONScopeImporter';
import gpxScopeImporter from '../../../utils/scopeImporters/gpxScopeImporter';
import kmlScopeImporter from '../../../utils/scopeImporters/kmlScopeImporter';
import {useScopePoints, useScopeTracks} from '../../../hooks/usePersistedCollections';
import {MAX_ALLOWED_IMPORT_FEATURES} from '../../../config';
import {useTranslation} from 'react-i18next';
import {PickedFile} from '@capawesome/capacitor-file-picker';

// This will support UTF-8 encoded files.
// See https://stackoverflow.com/questions/30106476/using-javascripts-atob-to-decode-base64-doesnt-properly-decode-utf-8-strings
/*function b64DecodeUnicode(base64string: string) {
  return decodeURIComponent(Array.prototype.map.call(window.atob(base64string), function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
}*/

const asDataUrl = (base64str: string, mimeType: string) => `data:${mimeType};base64,${base64str}`;

const importers: Record<string, (data: string) => Promise<ScopeImportResults>> = {
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
  const pickedFile = useFilePicker(Object.keys(importers), onError);
  const trackStore = useScopeTracks(scopeId);
  const pointStore = useScopePoints(scopeId);

  const importData = useCallback(async (file: PickedFile) => {
    const importer = importers[file.mimeType];
    if (importer && file.data) {
      const {points, tracks, numberOfErrors} = await importer(asDataUrl(file.data, file.mimeType));
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
