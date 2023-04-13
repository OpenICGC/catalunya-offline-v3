import {useEffect, useState} from 'react';

import {MapboxStyle} from 'react-map-gl';

import {BASEMAPS} from '../config';
import useDownloadStatus from './singleton/useDownloadStatus';
import {CalculateOfflineMapStyle} from '../utils/mapstyle';


type useMapStyleType = string | MapboxStyle | undefined;

const useMapStyle = (baseMapId: string): useMapStyleType => {
  const [mapStyle, setMapStyle] = useState<string | MapboxStyle>();
  const {isOfflineReady, downloadStatus} = useDownloadStatus();

  useEffect(() => {
    const baseMap = BASEMAPS.find(({id}) => id === baseMapId);
    if (baseMap) {
      if (isOfflineReady) {
        CalculateOfflineMapStyle(downloadStatus, baseMap)
          .then(setMapStyle);
      } else {
        setMapStyle(baseMap.style);
      }
    }
  }, [baseMapId, isOfflineReady]);

  return mapStyle;
};

export default useMapStyle;
