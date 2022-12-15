import {useEffect, useRef, useState} from 'react';
import {Capacitor} from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import {FileTransfer} from '@awesome-cordova-plugins/file-transfer';

import {CatOfflineError} from '../types/commonTypes';
import {downloadMbtiles} from '../utils/mbtiles';

interface fileTransferDownload {
  download: (url: string) => void;
  uri: string | undefined;
  progress: number;
  cancel: () => void;
  error: CatOfflineError | undefined
}

const useFileTransferDownload = (): fileTransferDownload  => {
  
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<CatOfflineError|undefined>(undefined);
  const [uri, setUri] = useState<string|undefined>();
  
  const fileTransfer = useRef(FileTransfer.create());
  
  fileTransfer.current.onProgress((event) => {
    const newProgress = Math.round((event.loaded / event.total) * 100);

    if (newProgress > progress) setProgress(newProgress);

  });
  
  const downloadMobile = async (url: string) => {
    const filename = url.split('/').pop() || '';
    const directory = await Filesystem.getUri({directory: Directory.Data, path: ''});

    const path = directory.uri.replace('file://', '') + '/' + filename;
    setUri(path);

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
  };
  
  const download = (url: string) => {
    const platform = Capacitor.getPlatform();
    if (platform === 'web') {
      console.log('[useFileTransfer] Using web implementation.');
      downloadMbtiles(url);
      setProgress(100);
    } else {
      console.log('[useFileTransfer] Using Cordova implementation.');
      downloadMobile(url);
    }
  };

  useEffect(() => console.log(error), [error]);
  
  return {
    download,
    uri,
    progress,
    cancel: fileTransfer.current.abort,
    error
  };
};

export default useFileTransferDownload;