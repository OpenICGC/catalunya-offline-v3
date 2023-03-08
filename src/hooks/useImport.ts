import {useEffect, useState} from 'react';
import {FilePicker, PickedFile} from '@capawesome/capacitor-file-picker';

export interface ImportedFile extends PickedFile {
  dataDecoded: string
}

type useImportOptions = {
  types?: string[]
} 

const useImport = (
  options: useImportOptions
) => {
  const {
    types = [
      'application/vnd.geo+json',
      'application/geo+json',
      'application/vnd.google-earth.kml+xml',
      'vnd.gpxsee.map+xml',
      'application/gpx+xml',
      'application/octet-stream'
    ]
  } = options;

  const [file, setFile] = useState<ImportedFile|undefined>(undefined);
  
  useEffect(() => {
    const pickFiles = async () => {
      const result = await FilePicker.pickFiles({
        types,
        multiple: false,
        readData: true
      });

      if (result.files.length && result.files[0].data) {
        setFile({
          ...result.files[0],
          dataDecoded: window.atob(result.files[0].data)
        });
      }
    };

    pickFiles();
  }, []);
  
  return file;
};

export default useImport;
