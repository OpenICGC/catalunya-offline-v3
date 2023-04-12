import {useCallback, useEffect, useMemo, useState} from 'react';

import {BASEMAPS, OFFLINE_DATASOURCES, OFFLINE_GLYPHS} from '../config';
import {offlineDirExists, onlineFileSize} from '../utils/filesystem';
import {singletonHook} from 'react-singleton-hook';


export enum downloadStatusStatus {
  unknown,
  pending,
  downloading,
  unzipping,
  done
}

export type downloadStatusTypeUnit = {
  url: string,
  localPath: string,
  labels: {
    [index: string]: string;
    ca: string;
    en: string;
    es: string;
  },
  contentLength?: number,
  downloadProgress?: number,
  status: downloadStatusStatus
}

export type downloadStatusType = Array<downloadStatusTypeUnit>

export type InfoType = {
  totalItems: number,
  completedItems: number
  progress?: number,
  currentItem: downloadStatusTypeUnit | undefined
}

const initialGlyphStatus: downloadStatusTypeUnit = {
  url: OFFLINE_GLYPHS,
  localPath: 'glyphs/',
  labels: {
    ca: 'Tipografies',
    en: 'Fonts',
    es: 'Tipografías'
  },
  contentLength: undefined,
  status: downloadStatusStatus.unknown
};

const initialStyleStatus: downloadStatusType = BASEMAPS.flatMap(basemap => {
  const basemaps = [{
    url: basemap.thumbnail,
    localPath: `styles/${basemap.id}/thumbnail.png`,
    labels: basemap.labels,
    contentLength: undefined,
    status: downloadStatusStatus.unknown
  }, {
    url: basemap.style,
    localPath: `styles/${basemap.id}/style.json`,
    labels: basemap.labels,
    contentLength: undefined,
    status: downloadStatusStatus.unknown
  }];
  
  if (basemap.sprites) {
    basemaps.push({
      url: basemap.sprites,
      localPath: `styles/${basemap.id}/sprites/`,
      labels: basemap.labels,
      contentLength: undefined,
      status: downloadStatusStatus.unknown
    });
  }
  
  return basemaps;
});

const initialDatasourceStatus: downloadStatusType = OFFLINE_DATASOURCES.map(datasource => (
  {
    url: datasource.url,
    localPath: `datasources/${datasource.id}.mbtiles`,
    labels: datasource.labels,
    contentLength: undefined,
    status: downloadStatusStatus.unknown
  }
));

const useDownloadStatusImpl = (): {
  isOfflineReady: boolean | undefined,
  downloadStatus: downloadStatusType,
  setDownloadProgress: (url: string, newBytes: number) => void,
  setStatus: (url: string, newStatus: downloadStatusStatus) => void,
  info: InfoType,
  pendingSize: number
} => {
  // 1. Rellenar array de downloadStatus con el estado inicial (síncrono): url, localPath, labels,
  // contentLength=undefined, status="unknown"
  const [downloadStatus, setDownloadStatus] = useState<downloadStatusType>([
    initialGlyphStatus,
    ...initialStyleStatus,
    ...initialDatasourceStatus
  ]);

  const [isOfflineReady, setIsOfflineReady] = useState<boolean>();
  const [pendingSize, setPendingSize] = useState<number>(0);

  useEffect(() => {
    const estadoyPesosPromises = downloadStatus.map(st => {
      // 2. Asíncronamente, leer si existe el recurso en local. Si existe, poner status a "done".
      // Si no existe, poner status a "pending".
      return offlineDirExists(st.localPath)
        .then(exists => exists ?
          downloadStatusStatus.done :
          downloadStatusStatus.pending
        )
        .then(status => {
          return status === downloadStatusStatus.pending ?
            onlineFileSize(st.url).then(bytes => ({url: st.url, status: status, contentLength: bytes})) :
            Promise.resolve({url: st.url, status: status, contentLength: 0});
        });
    });

    Promise.all(estadoyPesosPromises)
      .then(estadosyPesos => {
        // 4. Asignar estado y contentLength, ahora ya resueltos, al downloadStatus
        setDownloadStatus(prevStatus =>
          prevStatus
            .map(downloadStatus => ({
              ...downloadStatus,
              ...estadosyPesos.find(({url}) => url === downloadStatus.url)
            }))
        );
        const size = estadosyPesos.reduce((acc, cur) => {
          return acc + (cur.contentLength ? cur.contentLength : 0);
        }, 0);
        setPendingSize(size);
      });
  }, []);

  useEffect(() => {
    // 5. Cuando todos los downloadStatus.status dejen de estar en unknown, poner isOfflineReady a true o false.
    // Y esto es lo que indicará que puede empezar a usarse o que ya está listo.
    if (downloadStatus.every(({status}) => status === downloadStatusStatus.done)) {
      setIsOfflineReady(true);
    } else if (downloadStatus.every(({status}) => status !== downloadStatusStatus.unknown)) {
      setIsOfflineReady(false);
    }
  }, [downloadStatus]);


  const setStatus = useCallback((url:string, newStatus: downloadStatusStatus) => {
    setDownloadStatus(prevData =>
      prevData.map(item => item.url === url ?
        {...item, status: newStatus} :
        item
      )
    );
  }, []);

  const setDownloadProgress = useCallback((url:string, newBytes: number) => {
    setDownloadStatus(prevData =>
      prevData.map(item => item.url === url ?
        {...item, downloadProgress: newBytes} :
        item
      )
    );
  }, []);

  const info = useMemo<InfoType>(() => {
    const totalSize = downloadStatus.reduce((acc, cur) => {
      return acc + (cur.contentLength ? cur.contentLength : 0);
    }, 0);
    const downloadedSize = downloadStatus.reduce((acc, cur) => {
      return acc + (cur.downloadProgress ? cur.downloadProgress : 0);
    }, 0);

    // Percentage with one decimal digit, or undefined if unzipping
    const progress = Math.floor(1000 * downloadedSize / totalSize) / 10;

    return {
      totalItems: downloadStatus.length,
      completedItems: downloadStatus.filter(({status}) => status === downloadStatusStatus.done).length,
      progress: downloadStatus.every(({status}) => status === downloadStatusStatus.done || status === downloadStatusStatus.unzipping) ? undefined : progress,
      currentItem: downloadStatus.find(({status}) => status === downloadStatusStatus.downloading)
    };
  }, [downloadStatus]);

  return {
    isOfflineReady,
    downloadStatus,
    setDownloadProgress,
    setStatus,
    info,
    pendingSize
  };
};

const useDownloadStatusInit = () => ({
  isOfflineReady: undefined,
  downloadStatus: [],
  setDownloadProgress: () => undefined,
  setStatus: () => undefined,
  info: {totalItems: 0, completedItems: 0, progress: 0, currentItem: undefined},
  pendingSize: 0
});

const useDownloadStatus = singletonHook(useDownloadStatusInit, useDownloadStatusImpl);

export default useDownloadStatus;
