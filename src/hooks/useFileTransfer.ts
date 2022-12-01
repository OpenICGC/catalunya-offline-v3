import {useEffect, useRef, useState} from 'react';
import {Capacitor} from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import {FileTransfer} from '@awesome-cordova-plugins/file-transfer';

import {CatOfflineError} from '../types/commonTypes';
import {downloadMbtiles} from '../utils/mbtiles';

interface fileTransferDownload {
  uri: string | undefined;
  progress: number | undefined;
  cancel: () => void;
  error: CatOfflineError | undefined
}

const useFileTransferDownload = (
  url: string
): fileTransferDownload  => {
  
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<CatOfflineError|undefined>(undefined);
  const [filename] = useState<string>(url.split('/').pop() || '');
  const [uri, setUri] = useState<string|undefined>();
  
  const fileTransfer = useRef(FileTransfer.create());
  
  fileTransfer.current.onProgress((event) => {
    const newProgress = Math.round((event.loaded / event.total) * 100);

    if (newProgress > progress) setProgress(newProgress);

  });
  
  const download = async (url: string) => {
    const directory = await Filesystem.getUri({directory: Directory.Data, path: ''});
    let fileExists = false;

    const files = await Filesystem.readdir({path: '', directory: Directory.Data});

    files.files.map(({name}) => {
      if (name === filename && !fileExists) fileExists = true;
    });

    console.log('files: ', files);

    const path = directory.uri.replace('file://', '') + '/' + filename;
    setUri(path);

    if (!fileExists) {
      fileTransfer.current
        .download(url, path, true)
        .then(() => {
          console.log('[useFileTransfer] Download complete!');
        })
        .catch((error) => {
          setError({
            code: '99',
            message: error
          });
        });
    } else {
      setProgress(100);
      console.log('[useFileTransfer] File exists. Download ommited!');
    }
  };
  
  useEffect(() => {
    const platform = Capacitor.getPlatform();
    if (platform === 'web') {
      console.log('[useFileTransfer] Using web implementation.');
      downloadMbtiles(url);
      setUri(filename.split('.')[0]);
      setProgress(100);
    } else {
      console.log('[useFileTransfer] Using Cordova implementation.');
      download(url);
    }
  }, []);

  useEffect(() => console.log(error), [error]);
  
  return {
    uri,
    progress,
    cancel: fileTransfer.current.abort,
    error
  };
};

export default useFileTransferDownload;