import React, {FC, useEffect, useState} from 'react';

import {FileInfo} from '@capacitor/filesystem';
import {Capacitor} from '@capacitor/core';
import {useTranslation} from 'react-i18next';
import useFetch from '@geomatico/geocomponents/hooks/useFetch';
import {StyleSpecification} from 'maplibre-gl';

import {BaseMap} from '../../types/commonTypes';
import DownloadRequest from '../notifications/DownloadRequest';
import useFileTransferDownload from '../../hooks/useFileTransfer';
import DownloadProgress from '../notifications/DownloadProgress';
import {getDatabase} from '../../utils/mbtiles';
import Notification from '../notifications/Notification';
import {readFiles} from '../../utils/filesystem';


export type DownloadsManagerProps = {
  mapstyle: BaseMap,
  onStyleDownloaded: (mapStyle: StyleSpecification | string) => void
};

export type MbTilesMetadata = {
  id: string,
  url: string
}

const DownloadsManager: FC<DownloadsManagerProps> = ({mapstyle, onStyleDownloaded}) => {
  const {t} = useTranslation();

  const [open, setOpen] = useState<boolean>(false);
  const [accepted, setAccepted] = useState<boolean|undefined>(undefined);
  const [errorOpen, setErrorOpen] = useState<boolean>(false);
  const [existingFilesOnDevice, setExistingFilesOnDevice] = useState<Array<FileInfo> | undefined>(undefined);
  const {data} = useFetch(mapstyle.offlineAssets);

  const {
    download,
    uri,
    progress,
    error,
    cancel
  } = useFileTransferDownload();

  
  useEffect(() => {
    if (mapstyle){
      readFiles(mapstyle.id).then(files => setExistingFilesOnDevice(files));
    }
  }, [mapstyle]);

  useEffect(() => {
    if (existingFilesOnDevice && data) {

      //Style
      let isStyleOnDevice = false;
      const styleFileName = data['style'].split('/').pop() || '';
      const existingStyle = existingFilesOnDevice.find(({name}) => name === styleFileName);

      if (existingStyle) {
        isStyleOnDevice = true;
        const url = Capacitor.convertFileSrc(existingStyle.uri);
        onStyleDownloaded(url);
      }

      //MBTILES
      let isAllMbtilesOnDevice = false;
      data['mbtiles'].map((mbtiles: MbTilesMetadata) => {
        const mbtilesFileName = mbtiles.url.split('/').pop() || '';
        const existingMbtiles = existingFilesOnDevice.find(({name}) => name === mbtilesFileName);
        if (existingMbtiles) {
          //TODO: comprobar todos!!
          isAllMbtilesOnDevice = true;
          getDatabase(existingMbtiles.uri.replace('file://', ''));
        }
      });

      if (!isAllMbtilesOnDevice || !isStyleOnDevice) {
        setOpen(true);
      }
    }
  }, [existingFilesOnDevice, data]);

  const handleDownloads = async () => {
    //style
    await download(data.style, mapstyle.id);
    //mbtiles
    data.mbtiles
      .map(async (mbtiles: MbTilesMetadata) => mbtiles.url && await download(mbtiles.url, mapstyle.id));
  };


  useEffect(() => {
    if (accepted && data){
      setOpen(false);
      handleDownloads();
    }
  }, [accepted, data]);

  useEffect(() => {
    if (accepted && progress === 100 && uri) {
      if (uri.endsWith('.json')) {
        const url = Capacitor.convertFileSrc(uri);
        onStyleDownloaded(url);
      } else {
        getDatabase(uri.replace('file://', ''));
      }
    }
  }, [accepted, progress, uri]);

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