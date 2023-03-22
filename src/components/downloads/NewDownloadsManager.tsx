import React, {useEffect, useMemo, useRef} from 'react';
import useDownloadStatus, {downloadStatusStatus, downloadStatusTypeUnit} from '../../hooks/useDownloadStatus';
import fileDownloader from '../../utils/fileDownloader';
import {unZipOnSameFolder} from '../../utils/filesystem';
import DownloadProgress from '../notifications/DownloadProgress';
import {useTranslation} from 'react-i18next';


type DownloadsManagerProps = {
  onCancelCbChanged: () => void
}
const NewDownloadManager = ({onCancelCbChanged}: DownloadsManagerProps) => {
  const {i18n} = useTranslation();
  const {isOfflineReady, downloadStatus, setDownloadProgress, setStatus, info} = useDownloadStatus();

  if (isOfflineReady) return null;

  const cancelAction = useRef<() => void>();

  const handleCancel = () => {
    if (cancelAction.current) {
      cancelAction.current();
      cancelAction.current = undefined;
    }
    onCancelCbChanged();
  };

  useEffect(() => {
    const pendingAssets = downloadStatus
      .filter(st => st.status === downloadStatusStatus.pending);

    if (pendingAssets) {

      const downloadAsset = (asset: downloadStatusTypeUnit) => {
        setStatus(asset.url, downloadStatusStatus.downloading);
        const onProgress = (bytes: number) => {
          setDownloadProgress(asset.url, bytes);
        };
        const {download, cancel} = fileDownloader(asset.url, asset.localPath, onProgress);
        cancelAction.current = cancel;
        return download()
          .then((path) => {
            if (typeof path === 'string' && path.split('.').pop()?.toUpperCase() === 'zip'.toUpperCase()) {
              unZipOnSameFolder(path)
                .then(() => {
                  setStatus(asset.url, downloadStatusStatus.done);
                });
            } else {
              setStatus(asset.url, downloadStatusStatus.done);
            }
          });
      };
      
      pendingAssets.reduce( async (previousPromise, item, index) => {
        await previousPromise;
      
        return cancelAction.current || index === 0 ? downloadAsset(item) : Promise.resolve();
      }, Promise.resolve());
    }
  }, []);

  return useMemo(() => <DownloadProgress
    progress={info.progress}
    onCancel={handleCancel}
    isOpen={info.progress < 100}
    description={info.currentItem ? info.currentItem?.labels[i18n.language.split('-')[0]] : ''}
  />, [info]);
};

export default NewDownloadManager;
