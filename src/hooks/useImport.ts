import {useEffect, useState} from 'react';
import {FilePicker, PickedFile} from '@capawesome/capacitor-file-picker';

export interface ImportedFile extends PickedFile {
  dataDecoded: string
}

type useImportOptions = {
  types?: string[]
} 
// This will support UTF-8 encoded files.
// See https://stackoverflow.com/questions/30106476/using-javascripts-atob-to-decode-base64-doesnt-properly-decode-utf-8-strings
function b64DecodeUnicode(base64string: string) {
  return decodeURIComponent(Array.prototype.map.call(window.atob(base64string), function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
}

const useImport = (
  options: useImportOptions,
  onCancel: () => void
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
      }).catch(() => 
        onCancel()
      );

      if (result && result.files.length && result.files[0].data) {
        setFile({
          ...result.files[0],
          dataDecoded: b64DecodeUnicode(result.files[0].data)
        });
      }
    };

    pickFiles();
  }, []);
  
  return file;
};

export default useImport;
