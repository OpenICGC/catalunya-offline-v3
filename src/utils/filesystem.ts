import {Directory, Filesystem} from '@capacitor/filesystem';
import {OFFLINE_DATADIR_NAME} from '../config';
import {BaseMap} from '../types/commonTypes';
import {Zip} from '@awesome-cordova-plugins/zip';

export const listOfflineDir = async (directory?:string) => {
  try {
    const files = await Filesystem.readdir({
      path: OFFLINE_DATADIR_NAME + '/' + directory,
      directory: Directory.Data
    });
    return files.files;
  } catch (e) {
    return [];
  }
};

export const offlineDirExists = async (directory:string) => {
  try {
    await Filesystem.readdir({
      path: OFFLINE_DATADIR_NAME + '/' + directory,
      directory: Directory.Data
    });
    return true;
  } catch (e) {
    return false;
  }
};

export const createDirectory = async (directory: string) => {
  return await Filesystem.mkdir({
    directory: Directory.Data,
    path: OFFLINE_DATADIR_NAME + '/' + directory,
    recursive: true
  });
};

export const getUri = async (directory: string) => {
  return await Filesystem.getUri({
    directory: Directory.Data,
    path: OFFLINE_DATADIR_NAME + '/' + directory,
  });
};

export const readFile = async (uri: string) => {
  return await Filesystem.readFile({
    path: uri
  });
};

export const getLastVersionOfBasemap = async (basemap: BaseMap) => {
  const files = await listOfflineDir(basemap.id);
  if (files.length) {
    const lastVersionFileInfo = files.sort().pop();
    if (lastVersionFileInfo){
      return lastVersionFileInfo.name;
    }
  } else {
    return undefined;
  }
};


export const getLastMetadataFileForBaseMap = async (basemap: BaseMap) => {
  const lastVersion = await getLastVersionOfBasemap(basemap);
  const filesOnBasemapVersionDir = await listOfflineDir(basemap.id + '/' + lastVersion);
  const assetsFileInfo = filesOnBasemapVersionDir.find(fileinfo => fileinfo.name === 'assets.json');
  if (assetsFileInfo) {
    return assetsFileInfo.uri;
  } else {
    return undefined;
  }
};

export const unZipOnSameFolder = async (uri: string) => {
  const unzipComplete = (resultCode: number) => {
    if (resultCode === 0){
      Filesystem.deleteFile({path: uri});
    } else {
      throw `Error unzipping zip! Path: ${uri}`;
    }
  };
  const filename = uri.split('/').pop() || '';
  const directoryUri = uri.replace(filename, '');
  Zip.unzip(uri, directoryUri, unzipComplete);
};

