import {FC, useEffect} from 'react';
import {Error, UUID} from '../../../types/commonTypes';
import useImport, {ImportedFile} from '../../../hooks/useImport';
import geoJSONImporter from '../../../utils/importers/geoJSONImporter';
import gpxImporter from '../../../utils/importers/gpxImporter';
import kmlImporter from '../../../utils/importers/kmlImporter';
import {useScopePoints, useScopeTracks} from '../../../hooks/usePersistedCollections';
import {MAX_ALLOWED_IMPORT_FEATURES} from '../../../config';
import {useTranslation} from 'react-i18next';


export type HandleImportProps = {
  scopeId: UUID,
  onSuccess: () => void
  onError: (error: Error) => void
  onCancel: () => void
}

const HandleImport: FC<HandleImportProps> = ({
  scopeId,
  onSuccess,
  onError,
  onCancel
}) => {

  const {t} = useTranslation();
  const file = useImport({}, onCancel);
  const trackStore = useScopeTracks(scopeId);
  const pointStore = useScopePoints(scopeId);

  useEffect(() => {
    const importData = async (file: ImportedFile) => {
      const extension = file.name.split('.').pop()?.toLowerCase();
      const importer =
       extension === 'geojson' ? geoJSONImporter :
         extension === 'gpx' ? gpxImporter :
           extension === 'kml' ? kmlImporter :
             undefined;
      if (importer) {
        const {points, tracks, numberOfErrors} = await importer(file.dataDecoded);
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
    };

    if (file) {
      importData(file);
    }
  }, [file]);

  return null;
};

export default HandleImport;