import {MapboxStyle} from 'react-map-gl';
import {downloadStatusType} from '../hooks/singleton/useDownloadStatus';
import {BaseMap} from '../types/commonTypes';
import {OFFLINE_DATASOURCES, OFFLINE_GLYPHS} from '../config';
import {Capacitor} from '@capacitor/core';
import {getDatabase} from './mbtiles';
import {getUri} from './filesystem';

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
    if (glyphsAsset?.localPath) newStyle = {...newStyle, glyphs: Capacitor.convertFileSrc(directory?.uri + '/' + glyphsAsset.localPath) + 'glyphs/{fontstack}/{range}.pbf'};
    if (spritesAssets?.localPath) newStyle = {...newStyle, sprite: Capacitor.convertFileSrc(directory?.uri + '/' + spritesAssets.localPath) + 'sprites/sprites'};
    //Recorrer mejor los sourdces del estilo
    newStyle = {
      ...newStyle,
      sources: Object.keys(newStyle.sources).reduce((acc, cur) => {
        const mbtile = mbtilesAssets.find(mb => mb.localPath.endsWith(cur + '.mbtiles'));
        if (mbtile) {
          acc[cur] = cur === 'terreny' ? {
            'type': 'raster-dem',
            'tiles': [
              `mbtiles://${cur}/{z}/{x}/{y}.pbf`
            ],
            'tileSize': 256,
            'maxzoom': 15
          } :{
            'type': 'vector',
            'tiles': [
              `mbtiles://${cur}/{z}/{x}/{y}.pbf`
            ],
          };
        } else {
          acc[cur] = newStyle.sources[cur];
        }
        
        return acc;
      }, {} as MapboxStyle['sources'])
    };

    return newStyle;
  }
};