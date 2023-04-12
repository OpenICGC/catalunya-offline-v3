import {useEffect, useMemo, useState} from 'react';

import {MapboxStyle} from 'react-map-gl';

import {BaseMap} from '../types/commonTypes';
import {BASEMAPS, INITIAL_BASEMAP} from '../config';
import useDownloadStatus from './useDownloadStatus';
import {CalculateOfflineMapStyle} from '../utils/mapstyle';


type useMapStyleProps = {
  baseMapId: string
}

const useMapStyle = ({baseMapId = INITIAL_BASEMAP.id}: useMapStyleProps): string | MapboxStyle => {

  const {isOfflineReady, downloadStatus} = useDownloadStatus();
  const [mapStyle, setMapStyle] = useState<string | MapboxStyle>(INITIAL_BASEMAP.style);

  const baseMap = useMemo<BaseMap>(() => {
    const basemap = BASEMAPS.find(({id}) => id === baseMapId);
    if (basemap) {
      return basemap;
    } else {
      return INITIAL_BASEMAP;
    }
  }, [baseMapId]);

  useEffect(() => {
    if (!isOfflineReady && mapStyle !== baseMap.style) {
      setMapStyle(baseMap.style);
    } else if (isOfflineReady) {
      CalculateOfflineMapStyle(downloadStatus, baseMap)
        .then(mapstyle => {
          if (mapstyle) setMapStyle(mapstyle);
        });
    }
  }, [baseMap, isOfflineReady, downloadStatus]);

  return useMemo(() => mapStyle, [mapStyle]);
};

export default useMapStyle;