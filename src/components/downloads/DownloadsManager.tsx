import React, {FC, useEffect, useReducer, useState} from 'react';

import {FileInfo} from '@capacitor/filesystem';
import {Capacitor} from '@capacitor/core';
import {useTranslation} from 'react-i18next';
import useFetch from '@geomatico/geocomponents/hooks/useFetch';
import {StyleSpecification} from 'maplibre-gl';

import { compareVersions } from 'compare-versions';

import {BaseMap} from '../../types/commonTypes';
import DownloadRequest from '../notifications/DownloadRequest';
import useFileTransferDownload from '../../hooks/useFileTransfer';
import DownloadProgress from '../notifications/DownloadProgress';
import {getDatabase} from '../../utils/mbtiles';
import Notification from '../notifications/Notification';
import {
  getLastMetadataFileForBaseMap,
  getLastVersionOfBasemap,
  listOfflineDir,
  unZipOnSameFolder
} from '../../utils/filesystem';


export type DownloadsManagerProps = {
  baseMap: BaseMap,
  onStyleReady: (mapStyle: StyleSpecification | string) => void
};

export type MbTilesMetadata = {
  id: string,
  url: string
}

export type AssetsMetadata = {
  version: string,
  date: string,
  style: string,
  mbtiles: Array<MbTilesMetadata>,
  glyphs: string,
  sprites: string
}

enum downloadUnitType { mbtiles = 'mbtiles', style = 'style', glyphs = 'glyphs', sprites = 'sprites', metadata = 'metadata'}
enum downloadUnitStatus { REQUEST, SUCCESS, DONE}

type AssetsDownloadUnit = {
  type: downloadUnitType,
  url: string,
  uri?: string,
  status: downloadUnitStatus
}

const initialState: Array<AssetsDownloadUnit> = [];

const initState = () => initialState;

const reducer = (state: Array<AssetsDownloadUnit>, action: {type: string, payload?: AssetsDownloadUnit}) => {
  switch (action.type) {
  case 'REQUEST':
    return [...state, action.payload] as Array<AssetsDownloadUnit>;
  case 'SUCCESS':
    return [
      ...state.filter(asset => asset.url !== (action.payload && action.payload.url)),
      action.payload
    ] as Array<AssetsDownloadUnit>;
  case 'DONE':
    return [
      ...state.filter(asset => asset.url !== (action.payload && action.payload.url)),
      action.payload
    ] as Array<AssetsDownloadUnit>;
  case 'RESET':
    return initState();
  default:
    return state;
  }
};

const DownloadsManager: FC<DownloadsManagerProps> = ({baseMap, onStyleReady}) => {
  const {t, i18n} = useTranslation();

  const [open, setOpen] = useState<boolean>(false);
  const [accepted, setAccepted] = useState<boolean|undefined>(undefined);
  const [errorOpen, setErrorOpen] = useState<boolean>(false);
  const [cancelDownload, setCancelDownload] = useState<boolean>(false);
  const [existingFilesOnDevice, setExistingFilesOnDevice] = useState<Array<FileInfo> | undefined>(undefined);
  const [offlineMetadata, setOfflineMetadata] = useState<AssetsMetadata | undefined>(undefined);
  const [metadata, setMetadata] = useState<AssetsMetadata | undefined>(undefined);
  const [assetsDownloads, dispatch] = useReducer(reducer, initialState, initState);
  const [downloadDescription, setDownloadDescription] = useState<string>('');

  const {data: onlineMetadata} = useFetch(baseMap.offlineAssets);

  const {
    download,
    progress,
    error,
    cancel
  } = useFileTransferDownload();

  useEffect(() => {
    dispatch({type: 'RESET'});
    setAccepted(undefined);
    setErrorOpen(false);
    setCancelDownload(false);
    setExistingFilesOnDevice(undefined);
    setOfflineMetadata(undefined);
    setMetadata(undefined);
    setDownloadDescription('');
  }, [baseMap]);
  
  useEffect(() => {
    const getMetadata = async () => {
      const metadataUri = await getLastMetadataFileForBaseMap(baseMap);
      if (metadataUri) {
        const url = Capacitor.convertFileSrc(metadataUri);
        const res = await fetch(url);
        const data: AssetsMetadata = await res.json();
        setOfflineMetadata(data);
      }
    };

    getMetadata()
      .catch(console.error);
  }
  , [baseMap]);

  
  useEffect(() => {
    if (baseMap){
      setOfflineMetadata(undefined);
      setMetadata(undefined);
      setExistingFilesOnDevice(undefined);
      getLastVersionOfBasemap(baseMap).then(versionString => {
        listOfflineDir(baseMap.id + '/' + versionString).then(files => setExistingFilesOnDevice(files));
      });
    }
  }, [baseMap]);


  useEffect(() => {
    if (onlineMetadata || offlineMetadata) {
      const onlineVersion = onlineMetadata?.version;
      const offlineVersion = offlineMetadata?.version;

      if (onlineVersion && offlineVersion){
        if (compareVersions(onlineVersion, offlineVersion)) {
          setMetadata(onlineMetadata);
        } else {
          setMetadata(offlineMetadata);
        }
      } else if (onlineVersion) {
        setMetadata(onlineMetadata);
      } else if (offlineVersion) {
        setMetadata(offlineMetadata);
      }
    }
  }, [onlineMetadata, offlineMetadata]);

  useEffect(() => {
    
    if (existingFilesOnDevice && metadata) {
      //Style
      let isStyleOnDevice = false;
      const styleFileName = metadata['style'].split('/').pop() || '';
      const existingStyle = existingFilesOnDevice.find(({name}) => name === styleFileName);

      if (existingStyle) {
        isStyleOnDevice = true;
        dispatch({type: 'SUCCESS', payload: {type: downloadUnitType.style, url: metadata.style, uri: existingStyle.uri, status: downloadUnitStatus.SUCCESS}});
      }

      //MBTILES
      const isAllMbtilesOnDevice = !metadata['mbtiles'].map((mbtiles: MbTilesMetadata) => {
        const mbtilesFileName = mbtiles.url.split('/').pop() || '';
        const existingMbtiles = existingFilesOnDevice.find(({name}) => name === mbtilesFileName);
        if (existingMbtiles) {
          dispatch({type: 'SUCCESS', payload: {type: downloadUnitType.mbtiles, url: mbtiles.url, uri: existingMbtiles.uri, status: downloadUnitStatus.SUCCESS}});
          return true;
        } else {
          return false;
        }
      }).includes(false);

      //GLYPHS
      let isGlyphsOnDevice = false;
      if (metadata['glyphs']){
        const existingGlyphs = existingFilesOnDevice.find(({name}) => name === 'glyphs');

        if (existingGlyphs) {
          isGlyphsOnDevice = true;
          dispatch({type: 'SUCCESS', payload: {type: downloadUnitType.glyphs, url: metadata.glyphs, uri: existingGlyphs.uri, status: downloadUnitStatus.SUCCESS}});
        }
      } else {
        isGlyphsOnDevice = true;
      }

      //SPRITES
      let isSpritesOnDevice = false;
      if (metadata['sprites']) {
        const existingSprites = existingFilesOnDevice.find(({name}) => name === 'sprites');

        if (existingSprites) {
          isSpritesOnDevice = true;
          dispatch({type: 'SUCCESS', payload: {type: downloadUnitType.sprites, url: metadata.sprites, uri: existingSprites.uri, status: downloadUnitStatus.SUCCESS}});
        }
      } else {
        isSpritesOnDevice = true;
      }

      if (!isAllMbtilesOnDevice || !isStyleOnDevice || !isGlyphsOnDevice || !isSpritesOnDevice) {
        setOpen(true);
      }
    }
  }, [existingFilesOnDevice, metadata]);

  const handleDownloads = async (metadata: AssetsMetadata) => {
    //assets
    if (baseMap.offlineAssets){
      dispatch({type: 'REQUEST', payload: {type: downloadUnitType.metadata, url: baseMap.offlineAssets, status: downloadUnitStatus.REQUEST}});
    }
    //mbtiles
    for (const mbtiles of metadata.mbtiles) {
      dispatch({type: 'REQUEST', payload: {type: downloadUnitType.mbtiles, url: mbtiles.url, status: downloadUnitStatus.REQUEST}});
    }
    //glyphs
    if (metadata.glyphs) {
      dispatch({type: 'REQUEST', payload: {type: downloadUnitType.glyphs, url: metadata.glyphs, status: downloadUnitStatus.REQUEST}});
    }
    //sprites
    if (metadata.sprites) {
      dispatch({type: 'REQUEST', payload: {type: downloadUnitType.sprites, url: metadata.sprites, status: downloadUnitStatus.REQUEST}});
    }
    //style
    dispatch({type: 'REQUEST', payload: {type: downloadUnitType.style, url: metadata.style, status: downloadUnitStatus.REQUEST}});
  };


  useEffect(() => {
    if (!accepted) {
      setOpen(false);
    } else if (accepted && metadata){
      setOpen(false);
      handleDownloads(metadata);
    }
  }, [accepted, metadata]);

  const downloadAsset = (asset: AssetsDownloadUnit, directory: string) => {
    setDownloadDescription(baseMap.labels[i18n.language.split('-')[0]] + ' | ' + t(`downloadingAlert.${asset.type}`));
    download(asset.url, directory)
      .then(uri => {
        if (typeof uri === 'string') {
          if ([downloadUnitType.glyphs, downloadUnitType.sprites].includes(asset.type)) {
            unZipOnSameFolder(uri)
              .then((newUri) => {
                dispatch({type: 'SUCCESS', payload: {...asset, uri: newUri, status: downloadUnitStatus.SUCCESS}});
              });
          } else {
            dispatch({type: 'SUCCESS', payload: {...asset, uri, status: downloadUnitStatus.SUCCESS}});
          }
        }
      });
  };

  useEffect(() => {
    // Descarga de assets pendientes
    if (metadata){
      const directory = baseMap.id + '/' + metadata.version;
      const assetToDownload = assetsDownloads.find(asset => asset.status === downloadUnitStatus.REQUEST);

      if (assetToDownload && !cancelDownload) {
        downloadAsset(assetToDownload, directory);
      }
    }

    const styleAsset = assetsDownloads.find(asset => asset.type === downloadUnitType.style);

    if (styleAsset && styleAsset.status !== downloadUnitStatus.DONE) {
      // Carga de mbtiles
      assetsDownloads
        .filter(asset => asset.status === downloadUnitStatus.SUCCESS)
        .map(asset => {
          switch (asset.type) {
          case downloadUnitType.mbtiles:
            asset.uri && getDatabase(asset.uri.replace('file://', ''));
            dispatch({type: 'DONE', payload: {...asset, status: downloadUnitStatus.DONE}});
            break;
          case downloadUnitType.glyphs:
            dispatch({type: 'DONE', payload: {...asset, status: downloadUnitStatus.DONE}});
            break;
          case downloadUnitType.sprites:
            dispatch({type: 'DONE', payload: {...asset, status: downloadUnitStatus.DONE}});
            break;
          case downloadUnitType.metadata:
            dispatch({type: 'DONE', payload: {...asset, status: downloadUnitStatus.DONE}});
            break;
          default:
            break;
          }
        });

      const arrayToCheck = [];

      const glyphsAsset = assetsDownloads.find(asset => asset.type === downloadUnitType.glyphs);
      const spritesAssets = assetsDownloads.find(asset => asset.type === downloadUnitType.sprites);
      const mbtilesAssets = assetsDownloads.filter(asset => asset.type === downloadUnitType.mbtiles);
      const styleAsset = assetsDownloads.find(asset => asset.type === downloadUnitType.style);

      if (glyphsAsset) arrayToCheck.push(glyphsAsset);
      if (spritesAssets) arrayToCheck.push(spritesAssets);
      if (mbtilesAssets.length) arrayToCheck.push(...mbtilesAssets);

      if (
        arrayToCheck.every(asset => asset.status === downloadUnitStatus.DONE) &&
        styleAsset
      ) {
        parseStyle(styleAsset, glyphsAsset, spritesAssets)
          .then(() => dispatch({type: 'DONE', payload: {...styleAsset, status: downloadUnitStatus.DONE}}));
      }
    }
  }, [assetsDownloads, metadata, cancelDownload]);
  
  
  const parseStyle = async (styleAsset: AssetsDownloadUnit, glyphsAsset?: AssetsDownloadUnit, spritesAssets?: AssetsDownloadUnit) => {
    if (styleAsset.uri){
      const url = Capacitor.convertFileSrc(styleAsset.uri);
      const res = await fetch(url);
      const style: StyleSpecification = await res.json();

      let newStyle = {...style} as StyleSpecification;
      if (glyphsAsset?.uri) newStyle = {...newStyle, glyphs: Capacitor.convertFileSrc(glyphsAsset.uri) + '/{fontstack}/{range}.pbf'};
      if (spritesAssets?.uri) newStyle = {...newStyle, sprite: Capacitor.convertFileSrc(spritesAssets.uri) + '/sprites'};

      onStyleReady(newStyle);
    }
  };

  useEffect(() => {
    setErrorOpen(true);
  }, [error]);

  const handleCancel = () => {
    setCancelDownload(true);
    cancel();
  };

  return <div>
    <DownloadRequest
      isOpen={open}
      onClose={() => setAccepted(false)}
      onDownload={() => setAccepted(true)}
    />
    {error ?
      <Notification
        isOpen={errorOpen}
        message={cancelDownload ? t('downloadingAlert.cancel') : t('downloadingAlert.error')}
        onClose={() => setErrorOpen(false)}
        isPersistent={false}
      /> :
      <DownloadProgress
        progress={progress}
        onCancel={handleCancel}
        isOpen={accepted && progress < 100}
        description={downloadDescription}
      />
    }
  </div>;
};

export default DownloadsManager;