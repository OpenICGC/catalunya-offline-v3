import {useEffect, useState} from 'react';
import {FilePicker} from '@capawesome/capacitor-file-picker';
import {base64string, mimeType} from '../utils/loaders/types';
import {IS_WEB} from '../config';
import {CatOfflineError} from '../types/commonTypes';

export type FilePickerResult = {
  name: string,
  blob?: Blob,
  data?: base64string,
  mimeType?: mimeType
}

const useFilePicker = (
  mimeTypes: Array<mimeType>,
  onError: (error: CatOfflineError) => void
): FilePickerResult | undefined => {
  const [pickedFile, setPickedFile] = useState<FilePickerResult>();

  useEffect(() => {
    const pickFiles = async () => {
      const result = await FilePicker.pickFiles({
        types: mimeTypes,
        multiple: false,
        readData: !IS_WEB // Will use `result.data` on Android & iOS, and `result.blob` on Web
      }).catch(reason => {
        console.log('File Picker Error', reason);
        onError({code: 'errors.filePicker'});
      });

      if (result?.files.length) {
        setPickedFile(result.files[0] as FilePickerResult);
      }
    };

    pickFiles();
  }, []);

  return pickedFile;
};

export default useFilePicker;
