import React, {useEffect, useMemo, useRef} from 'react';
import useDownloadStatus, {downloadStatusStatus, downloadStatusTypeUnit} from '../hooks/useDownloadStatus';
import fileDownloader from '../utils/fileDownloader';
import {unZipOnSameFolder} from '../utils/filesystem';
import DownloadProgress from '../components/notifications/DownloadProgress';
import {useTranslation} from 'react-i18next';

type DownloadManagerProps = {
  onCancelCbChanged: () => void
}
const DownloadManager = ({onCancelCbChanged}: DownloadManagerProps) => {
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
          const prev = asset.downloadProgress !== undefined ? asset.downloadProgress : 0;
          const total = asset.contentLength !== undefined ? asset.contentLength : 0;
          if ((bytes/total) - (prev/total) >= 0.001 || bytes === total) {
            // Update progress when difference is bigger than 0.1% for this file, or when done
            setDownloadProgress(asset.url, bytes);
          }
        };
        const {download, cancel} = fileDownloader(asset.url, asset.localPath, onProgress);
        cancelAction.current = cancel;
        return download()
          .then((path) => {
            if (typeof path === 'string' && path.split('.').pop()?.toUpperCase() === 'zip'.toUpperCase()) {
              setStatus(asset.url, downloadStatusStatus.unzipping);
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
    isOpen={info.progress !== 100}
    description={info.currentItem ? info.currentItem?.labels[i18n.language.split('-')[0]] : ''}
  />, [info]);
};

export default DownloadManager;
