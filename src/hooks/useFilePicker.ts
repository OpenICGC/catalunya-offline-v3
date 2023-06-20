import {useEffect, useState} from 'react';
import {FilePicker} from '@capawesome/capacitor-file-picker';
import {Error} from '../types/commonTypes';
import {base64string, mimeType} from '../utils/loaders/types';
import {IS_WEB} from '../config';

export type FilePickerResult = {
  name: string,
  blob?: Blob,
  data?: base64string,
  mimeType?: mimeType
}

const useFilePicker = (
  mimeTypes: Array<mimeType>,
  onError: (error: Error) => void
): FilePickerResult | undefined => {
  const [pickedFile, setPickedFile] = useState<FilePickerResult>();

  useEffect(() => {
    const pickFiles = async () => {
      const result = await FilePicker.pickFiles({
        types: mimeTypes,
        multiple: false,
        readData: !IS_WEB // Will use `result.data` on Android & iOS, and `result.blob` on Web
      }).catch(reason =>
        onError({name: 'File Picker Error', message: reason.toString()})
      );

      if (result?.files.length) {
        setPickedFile(result.files[0] as FilePickerResult);
      }
    };

    pickFiles();
  }, []);

  return pickedFile;
};

export default useFilePicker;
