import React, {FC, useEffect, useMemo, useState} from 'react';

import {StyleSpecification} from 'maplibre-gl';

import {BaseMap} from '../types/commonTypes';
import {BASEMAPS, INITIAL_BASEMAP, IS_WEB} from '../config';
import DownloadsManager from '../components/downloads/DownloadsManager';
import {Capacitor} from '@capacitor/core';

interface useMapStyle {
  baseMapId: string;
  mapStyle: string | StyleSpecification;
  setBaseMapId: (baseMapId: string ) => void;
  StyleOfflineDownloaderComponent: FC | JSX.Element
}

const useMapStyle = (): useMapStyle => {
  
  const [baseMap, setBaseMap] = useState<BaseMap>(INITIAL_BASEMAP);
  const [mapStyle, setMapStyle] = useState(INITIAL_BASEMAP.onlineStyle);

  const handleChangeBaseMapId = (baseMapId: string) => {
    const newBaseMap = BASEMAPS.find(({id}) => id === baseMapId);
    newBaseMap && setBaseMap(newBaseMap);
  };

  const handleStyleDownloaded = setMapStyle;

  useEffect(() => {
    if (baseMap.onlineStyle) {
      setMapStyle(baseMap.onlineStyle);
    }
  }, [baseMap]);
  
  const StyleOfflineDownloaderComponent = useMemo(() =>
    baseMap.offlineAssets && !IS_WEB ?
      <DownloadsManager baseMap={baseMap} onStyleReady={handleStyleDownloaded}/>
      : 
      <></>
  , [baseMap]);
  
  
  
  return {
    baseMapId: baseMap.id,
    mapStyle,
    setBaseMapId: handleChangeBaseMapId,
    StyleOfflineDownloaderComponent
  };
};

export default useMapStyle;