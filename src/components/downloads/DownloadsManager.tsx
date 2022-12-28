import React, {FC, useEffect, useReducer, useState} from 'react';

import {FileInfo} from '@capacitor/filesystem';
import {Capacitor} from '@capacitor/core';
import {useTranslation} from 'react-i18next';
import i18n from 'i18next';
import useFetch from '@geomatico/geocomponents/hooks/useFetch';
import {StyleSpecification} from 'maplibre-gl';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {gt} from '@storybook/semver';

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

type AssetsDownloadUnit = {
  type: 'mbtile' | 'style' | 'glyphs' | 'sprites' | 'assets',
  url: string,
  uri?: string,
  status: 'REQUEST' | 'SUCCESS' | 'DONE'
}

const initialState = [] as AssetsDownloadUnit[];

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
  const {t} = useTranslation();

  const [open, setOpen] = useState<boolean>(false);
  const [accepted, setAccepted] = useState<boolean|undefined>(undefined);
  const [errorOpen, setErrorOpen] = useState<boolean>(false);
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
        if (gt(onlineVersion, offlineVersion)) {
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
        dispatch({type: 'SUCCESS', payload: {type: 'style', url: metadata.style, uri: existingStyle.uri, status: 'SUCCESS'}});
      }

      //MBTILES
      const isAllMbtilesOnDevice = !metadata['mbtiles'].map((mbtiles: MbTilesMetadata) => {
        const mbtilesFileName = mbtiles.url.split('/').pop() || '';
        const existingMbtiles = existingFilesOnDevice.find(({name}) => name === mbtilesFileName);
        if (existingMbtiles) {
          dispatch({type: 'SUCCESS', payload: {type: 'mbtile', url: mbtiles.url, uri: existingMbtiles.uri, status: 'SUCCESS'}});
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
          dispatch({type: 'SUCCESS', payload: {type: 'glyphs', url: metadata.glyphs, uri: existingGlyphs.uri, status: 'SUCCESS'}});
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
          dispatch({type: 'SUCCESS', payload: {type: 'sprites', url: metadata.sprites, uri: existingSprites.uri, status: 'SUCCESS'}});
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
    const directory = baseMap.id + '/' + metadata.version;
    //assets
    if (baseMap.offlineAssets){
      dispatch({type: 'REQUEST', payload: {type: 'assets', url: baseMap.offlineAssets, status: 'REQUEST'}});
      setDownloadDescription(baseMap.labels[i18n.language.split('-')[0]] + ' | ' + t('downloadingAlert.metadata'));
      const uri = await download(baseMap.offlineAssets, directory);
      dispatch({type: 'SUCCESS', payload: {type: 'assets', url: baseMap.offlineAssets, uri, status: 'SUCCESS'}});
    }
    //mbtiles
    for (const mbtiles of metadata.mbtiles) {
      dispatch({type: 'REQUEST', payload: {type: 'mbtile', url: mbtiles.url, status: 'REQUEST'}});
      setDownloadDescription(baseMap.labels[i18n.language.split('-')[0]] + ' | ' + t('downloadingAlert.mbtiles'));
      const uri = await download(mbtiles.url, directory);
      dispatch({type: 'SUCCESS', payload: {type: 'mbtile', url: mbtiles.url, uri, status: 'SUCCESS'}});
    }

    //glyphs
    if (metadata.glyphs) {
      dispatch({type: 'REQUEST', payload: {type: 'glyphs', url: metadata.glyphs, status: 'REQUEST'}});
      setDownloadDescription(baseMap.labels[i18n.language.split('-')[0]] + ' | ' + t('downloadingAlert.glyphs'));
      const uri = await download(metadata.glyphs, directory);
      uri && await unZipOnSameFolder(uri);
      dispatch({type: 'SUCCESS', payload: {type: 'glyphs', url: metadata.glyphs, uri, status: 'SUCCESS'}});
    }

    //sprites
    if (metadata.sprites) {
      dispatch({type: 'REQUEST', payload: {type: 'sprites', url: metadata.sprites, status: 'REQUEST'}});
      setDownloadDescription(baseMap.labels[i18n.language.split('-')[0]] + ' | ' + t('downloadingAlert.sprites'));
      const uri = await download(metadata.sprites, directory);
      uri && await unZipOnSameFolder(uri);
      dispatch({type: 'SUCCESS', payload: {type: 'sprites', url: metadata.sprites, uri, status: 'SUCCESS'}});
    }

    //style
    dispatch({type: 'REQUEST', payload: {type: 'style', url: metadata.style, status: 'REQUEST'}});
    setDownloadDescription(baseMap.labels[i18n.language.split('-')[0]] + ' | ' + t('downloadingAlert.style'));
    const uri = await download(metadata.style, directory);
    dispatch({type: 'SUCCESS', payload: {type: 'style', url: metadata.style, uri, status: 'SUCCESS'}});
  };


  useEffect(() => {
    if (accepted && metadata){
      setOpen(false);
      handleDownloads(metadata);
    }
  }, [accepted, metadata]);

  useEffect(() => {
    console.log(assetsDownloads);
    assetsDownloads
      .filter(asset => asset.status === 'SUCCESS')
      .map(asset => {
        switch (asset.type) {
        case 'mbtile':
          asset.uri && getDatabase(asset.uri.replace('file://', ''));
          break;
        case 'glyphs':
          break;
        case 'sprites':
          break;
        case 'assets':
          break;
        default:
          break;
        }
        dispatch({type: 'DONE', payload: {...asset, status: 'DONE'}});
      });

    const arrayToCheck = [];

    const glyphsAsset = assetsDownloads.find(asset => asset.type === 'glyphs');
    const spritesAssets = assetsDownloads.find(asset => asset.type === 'sprites');
    const mbtilesAssets = assetsDownloads.filter(asset => asset.type === 'mbtile');
    const styleAsset = assetsDownloads.find(asset => asset.type === 'style');

    if (glyphsAsset) arrayToCheck.push(glyphsAsset);
    if (spritesAssets) arrayToCheck.push(spritesAssets);
    if (mbtilesAssets.length) arrayToCheck.push(...mbtilesAssets);

    if (
      arrayToCheck.every(asset => asset.status === 'DONE') &&
      styleAsset
    ) {
      parseStyle(styleAsset, glyphsAsset, spritesAssets)
        .then(() => dispatch({...styleAsset, status: 'DONE'} as AssetsDownloadUnit));
    }
  }, [assetsDownloads, metadata]);
  
  
  const parseStyle = async (styleAsset: AssetsDownloadUnit, glyphsAsset?: AssetsDownloadUnit, spritesAssets?: AssetsDownloadUnit) => {
    if (styleAsset.uri){
      const url = Capacitor.convertFileSrc(styleAsset.uri);
      const res = await fetch(url);
      const style: StyleSpecification = await res.json();

      let newStyle = {...style} as StyleSpecification;
      if (glyphsAsset?.uri) newStyle = {...newStyle, glyphs: Capacitor.convertFileSrc(glyphsAsset.uri) + '/{fontstack}/{range}.pbf'};
      if (spritesAssets?.uri) newStyle = {...newStyle, sprite: Capacitor.convertFileSrc(spritesAssets.uri)};

      onStyleReady(newStyle);
    }
  };

  useEffect(() => {
    setErrorOpen(true);
  }, [error]);

  return <div>
    <DownloadRequest
      isOpen={open}
      onClose={() => setAccepted(false)}
      onDownload={() => setAccepted(true)}
    />
    {error ?
      <Notification
        isOpen={errorOpen}
        message={t('downloadingError')}
        onClose={() => setErrorOpen(false)}
        isPersistent={false}
      /> :
      <DownloadProgress
        progress={progress}
        onClose={cancel}
        isOpen={accepted && progress < 100}
        description={downloadDescription}
      />
    }
  </div>;
};

export default DownloadsManager;