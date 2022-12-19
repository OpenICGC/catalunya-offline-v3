import {useRef, useState} from 'react';
import {Capacitor} from '@capacitor/core';
import {FileTransfer} from '@awesome-cordova-plugins/file-transfer';

import {CatOfflineError} from '../types/commonTypes';
import {downloadMbtiles} from '../utils/mbtiles';
import {createDirectory, getUri, offlineDirExists} from '../utils/filesystem';

interface fileTransferDownload {
  download: (url: string, directory: string|undefined) => Promise<void>;
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

  const downloadMobile = async (url: string, newDirectory: string) => {
    const filename = url.split('/').pop() || '';
    if (!(await offlineDirExists(newDirectory))){
      await createDirectory(newDirectory);
    }
    const directory = await getUri(newDirectory);

    const path = directory.uri.replace('file://', '') + '/' + filename;
    setUri(path);

    return fileTransfer.current
      .download(url, path, true)
      .then(() => {
        console.log('[useFileTransfer] Download complete!');
      })
      .catch((error) => {
        setError(error);
      });
  };
  
  const download = async (url: string, directory:string|undefined) => {
    setProgress(0);
    setError(undefined);
    setUri(undefined);
    const platform = Capacitor.getPlatform();
    if (platform === 'web') {
      console.log('[useFileTransfer] Using web implementation.');
      downloadMbtiles(url);
      setProgress(100);
    } else {
      if (directory){
        console.log('[useFileTransfer] Using Cordova implementation.');
        await downloadMobile(url, directory);
      }
    }
  };
  
  return {
    download,
    uri,
    progress,
    cancel: fileTransfer.current.abort,
    error
  };
};

export default useFileTransferDownload;