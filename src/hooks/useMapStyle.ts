import {useEffect, useState} from 'react';

import {MapboxStyle} from 'react-map-gl';

import {BASEMAPS} from '../config';
import useDownloadStatus from './singleton/useDownloadStatus';
import {CalculateOfflineMapStyle} from '../utils/mapstyle';
import {Layer} from 'mapbox-gl';


type useMapStyleType = MapboxStyle | undefined;

const removeHiddenLayers = (style: MapboxStyle | undefined): MapboxStyle | undefined => style ? {
  ...style,
  layers: style.layers.filter(layer => (layer as Layer)?.layout?.visibility !== 'none')
} : undefined;

const useMapStyle = (baseMapId: string): useMapStyleType => {
  const [mapStyle, setMapStyle] = useState<MapboxStyle>();
  const {isOfflineReady, downloadStatus} = useDownloadStatus();

  useEffect(() => {
    const baseMap = BASEMAPS.find(({id}) => id === baseMapId);
    if (baseMap) {
      if (isOfflineReady) {
        CalculateOfflineMapStyle(downloadStatus, baseMap).then(removeHiddenLayers).then(setMapStyle);
      } else {
        fetch(baseMap.style).then(response => response.json()).then(removeHiddenLayers).then(setMapStyle);
      }
    }
  }, [baseMapId, isOfflineReady]);

  return mapStyle;
};

export default useMapStyle;
