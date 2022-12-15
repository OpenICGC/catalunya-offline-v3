import React, {FC, useEffect, useState} from 'react';
import {Manager} from '../../types/commonTypes';
import DownloadRequest from '../notifications/DownloadRequest';
import useFileTransferDownload from '../../hooks/useFileTransfer';
import {MAPSTYLES, MBTILES} from '../../config';
import DownloadProgress from '../notifications/DownloadProgress';
import {getDatabase} from '../../utils/mbtiles';
import Notification from '../notifications/Notification';
import {Directory, Filesystem, ReaddirResult} from '@capacitor/filesystem';
import {useTranslation} from 'react-i18next';
import useFetch from '@geomatico/geocomponents/hooks/useFetch';


export type DownloadsManagerProps = {
  manager: Manager
};



const DownloadsManager: FC<DownloadsManagerProps> = ({manager}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [accepted, setAccepted] = useState<boolean|undefined>(undefined);
  const [errorOpen, setErrorOpen] = useState<boolean>(false);
  const [existingFiles, setExistingFiles] = useState<ReaddirResult | undefined>(undefined);

  const {t} = useTranslation();

  const {
    download,
    uri,
    progress,
    error,
    cancel
  } = useFileTransferDownload();
  
  const readFiles = async () => {
    const files = await Filesystem.readdir({path: '', directory: Directory.Data});
    
    setExistingFiles(files);
  };
  
  useEffect(() => {
    readFiles();
  }, []);

  useEffect(() => {
    /*if (existingFiles) {
      MAPSTYLES
        .filter(({offlineAssets}) => offlineAssets)
        .map(mapstyle => {
          const {data} = useFetch(mapstyle.offlineAssets);
          console.log(data);
        });
    }*/
    if (existingFiles){
      const filename = MBTILES.downloadMbtilesUrl.split('/').pop() || '';
      const existingFile = existingFiles?.files.find(({name}) => name === filename)?.uri;

      if (existingFile) {
        getDatabase(existingFile.replace('file://', ''));
      } else {
        setOpen(true);
      }  
    }
  }, [existingFiles]);


  useEffect(() => {
    if (accepted){
      setOpen(false);
      download(MBTILES.downloadMbtilesUrl);
    }
  }, [accepted]);

  useEffect(() => {
    if (accepted && progress === 100 && uri) {
      getDatabase(uri);
    }
  }, [accepted, progress]);

  useEffect(() => {
    setErrorOpen(true);
  }, [error]);


  return <div>
    <DownloadRequest isOpen={open} onClose={() => setAccepted(false)} onDownload={() => setAccepted(true)} />
    {error ?
      <Notification isOpen={errorOpen} message={t('downloadingError')} onClose={() => setErrorOpen(false)} isPersistent={false} /> :
      <DownloadProgress progress={progress} onClose={cancel} isOpen={accepted && progress < 100} />
    }
  </div>;
};

export default DownloadsManager;