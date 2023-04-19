import {MapboxStyle} from 'react-map-gl';
import {downloadStatusType} from '../hooks/singleton/useDownloadStatus';
import {BaseMap} from '../types/commonTypes';
import {OFFLINE_DATASOURCES, OFFLINE_GLYPHS} from '../config';
import {Capacitor} from '@capacitor/core';
import {getDatabase} from './mbtiles';
import {getUri} from './filesystem';
import {RasterDemSource, RasterSource, VectorSource} from 'mapbox-gl';

export const CalculateOfflineMapStyle = async (downloadStatus: downloadStatusType, baseMap: BaseMap): Promise<MapboxStyle|undefined> => {
  const glyphsAsset = downloadStatus.find(st => st.url === OFFLINE_GLYPHS);
  const spritesAssets = downloadStatus.find(st => st.url === baseMap.sprites);
  const mbtilesAssets = downloadStatus.filter(st => OFFLINE_DATASOURCES.map(({url}) => url).includes(st.url));
  const styleAsset = downloadStatus.find(st => st.url === baseMap.style);

  const directory = await getUri('');

  //Load mbtiles on sqlite
  mbtilesAssets.map(mb => getDatabase(directory?.uri.replace('file://', '') + '/' + mb.localPath));

  //Parse style to update assets origin
  if (styleAsset) {
    const url = Capacitor.convertFileSrc(directory?.uri + '/' + styleAsset.localPath);
    const res = await fetch(url);
    const style: MapboxStyle = await res.json();

    let newStyle = {...style} as MapboxStyle;
    if (glyphsAsset?.localPath) newStyle = {...newStyle, glyphs: Capacitor.convertFileSrc(directory?.uri + '/' + glyphsAsset.localPath) + '{fontstack}/{range}.pbf'};
    if (spritesAssets?.localPath) newStyle = {...newStyle, sprite: Capacitor.convertFileSrc(directory?.uri + '/' + spritesAssets.localPath) + newStyle?.sprite?.split('/').pop()};
    //Recorrer mejor los sourdces del estilo
    newStyle = {
      ...newStyle,
      sources: Object.keys(newStyle.sources).reduce((sources, sourceId) => {
        const existsOfflineAsset = !!mbtilesAssets.find(mb => mb.localPath.endsWith(sourceId + '.mbtiles'));
        if (existsOfflineAsset) {
          sources[sourceId] = {
            ...newStyle.sources[sourceId],
            tiles: [
              `mbtiles://${sourceId}/{z}/{x}/{y}.pbf`
            ]
          } as (VectorSource | RasterSource | RasterDemSource);
        } else {
          sources[sourceId] = newStyle.sources[sourceId];
        }
        
        return sources;
      }, {} as MapboxStyle['sources'])
    };

    return newStyle;
  }
};
