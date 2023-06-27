import {useEffect, useState} from 'react';
import {FilePicker} from '@capawesome/capacitor-file-picker';
import {base64string, mimeType} from '../utils/loaders/types';
import {IS_IOS, IS_WEB} from '../config';
import {CatOfflineError} from '../types/commonTypes';

export type FilePickerResult = {
  name: string,
  blob?: Blob,
  data?: base64string,
  mimeType?: mimeType
}

// Known list of file extension mime types
const typeFromExtension: Record<string, mimeType> = {
  'csv': 'text/csv',
  'geojson': 'application/geo+json',
  'gpx': 'application/gpx+xml',
  'kml': 'application/vnd.google-earth.kml+xml',
  'zip': 'application/zip'
};

const useFilePicker = (
  mimeTypes: Array<mimeType>,
  onError: (error: CatOfflineError) => void
): FilePickerResult | undefined => {
  const [pickedFile, setPickedFile] = useState<FilePickerResult>();

  useEffect(() => {
    const pickFiles = async () => {
      const result = await FilePicker.pickFiles({
        types: IS_IOS ? mimeTypes : undefined, // Filter by mime type in iOS only. Picks any file on Web or Android (filtering not reliable).
        multiple: false,
        readData: !IS_WEB // Will use `result.data` on Android & iOS, and `result.blob` on Web
      }).catch(reason => {
        console.log('File Picker Error', reason);
        onError({code: 'errors.filePicker'});
      });

      if (result?.files.length) {
        const file = result.files[0];
        const extension = file.name.split('.').pop();
        const knownMimeType = extension && typeFromExtension[extension] ? typeFromExtension[extension] : (file.mimeType as mimeType); // Get from known extension when available

        setPickedFile({
          name: file.name,
          blob: file.blob,
          data: file.data,
          mimeType: knownMimeType
        });
      }
    };

    pickFiles();
  }, []);

  return pickedFile;
};

export default useFilePicker;
