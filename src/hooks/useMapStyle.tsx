import React, {FC, useEffect, useMemo, useRef, useState} from 'react';

import {StyleSpecification} from 'maplibre-gl';

import {BaseMap} from '../types/commonTypes';
import {BASEMAPS, INITIAL_BASEMAP} from '../config';
import DownloadsManager from '../components/downloads/DownloadsManager';

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
    baseMap.offlineAssets ?
      <DownloadsManager mapstyle={baseMap} onStyleDownloaded={handleStyleDownloaded}/>
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