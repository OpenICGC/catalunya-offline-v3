import React, {FC, useEffect, useMemo, useState} from 'react';

import {MapboxStyle} from 'react-map-gl';

import {BASEMAPS, IS_WEB} from '../config';
import DownloadsManager from '../components/downloads/DownloadsManager';
import useBasemapId from './appState/useBasemapId';

interface useMapStyle {
  baseMapId: string;
  mapStyle: string | MapboxStyle;
  setBaseMapId: (baseMapId: string ) => void;
  StyleOfflineDownloaderComponent: FC | JSX.Element
}

const useMapStyle = (): useMapStyle => {

  const [basemapId, setBaseMapId] = useBasemapId();
  const baseMap = BASEMAPS.find(bm => bm.id === basemapId);

  const [mapStyle, setMapStyle] = useState(baseMap?.onlineStyle);

  const handleChangeBaseMapId = (baseMapId: string) => {
    setBaseMapId(baseMapId);
  };

  const handleStyleDownloaded = setMapStyle;

  useEffect(() => {
    if (baseMap?.onlineStyle) {
      setMapStyle(baseMap.onlineStyle);
    }
  }, [baseMap]);
  
  const StyleOfflineDownloaderComponent = useMemo(() =>
    baseMap?.offlineAssets && !IS_WEB ?
      <DownloadsManager baseMap={baseMap} onStyleReady={handleStyleDownloaded}/>
      : 
      <></>
  , [baseMap]);
  
  
  
  return {
    baseMapId: basemapId,
    mapStyle: mapStyle || '',
    setBaseMapId: handleChangeBaseMapId,
    StyleOfflineDownloaderComponent
  };
};

export default useMapStyle;