import {useEffect, useState} from 'react';
import {FilePicker, PickedFile} from '@capawesome/capacitor-file-picker';
import {Error} from '../types/commonTypes';

const useFilePicker = (
  mimeTypes: string[],
  onError: (error: Error) => void
): PickedFile | undefined => {
  const [pickedFile, setPickedFile] = useState<PickedFile>();

  useEffect(() => {
    const pickFiles = async () => {
      const result = await FilePicker.pickFiles({
        types: mimeTypes,
        multiple: false,
        readData: true
      }).catch(reason =>
        onError({name: 'File Picker Error', message: reason.toString()})
      );

      if (result?.files.length) {
        setPickedFile(result.files[0]);
      }
    };

    pickFiles();
  }, []);

  return pickedFile;
};

export default useFilePicker;
