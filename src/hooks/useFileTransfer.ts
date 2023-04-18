import {useRef, useState} from 'react';
import {FileTransfer, FileTransferError} from '@awesome-cordova-plugins/file-transfer';

import {CatOfflineError} from '../types/commonTypes';
import {createDirectory, FolderType, getUri, offlineDirExists} from '../utils/filesystem';

interface fileTransferDownload {
  download: (url: string, directory: string) => Promise<string|FileTransferError>;
  url: string | undefined;
  progress: number;
  cancel: () => void;
  error: CatOfflineError | undefined
}

const useFileTransferDownload = (): fileTransferDownload  => {

  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<CatOfflineError|undefined>(undefined);
  const [url, setUrl] = useState<string|undefined>();

  const fileTransfer = useRef(FileTransfer.create());

  fileTransfer.current.onProgress((event) => {
    const newProgress = Math.round((event.loaded / event.total) * 100);

    if (newProgress > progress) setProgress(newProgress);

  });

  const downloadMobile = async (url: string, newDirectory: string): Promise<string|FileTransferError> => {
    const filename = url.split('/').pop() || '';
    if (!(await offlineDirExists(newDirectory))){
      await createDirectory(newDirectory, FolderType.Download);
    }
    const directory = await getUri(newDirectory);

    const path = directory?.uri.replace('file://', '') + '/' + filename;
    const uri = directory?.uri + '/' + filename;

    return fileTransfer.current
      .download(url, path, true)
      .then(() => {
        //console.debug('[useFileTransfer] Download complete!');
        return uri;
      })
      .catch((error) => {
        setError(error);
        return error;
      });
  };
  
  const download = async (url: string, directory:string) => {
    setProgress(0);
    setError(undefined);
    setUrl(url);
    return downloadMobile(url, directory);
  };
  
  return {
    download,
    url,
    progress,
    cancel: () => fileTransfer.current.abort(),
    error
  };
};

export default useFileTransferDownload;