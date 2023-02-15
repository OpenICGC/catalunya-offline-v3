import {Directory, Encoding, Filesystem} from '@capacitor/filesystem';
import {EXPORT_DIR_NAME, OFFLINE_DATADIR_NAME} from '../config';
import {BaseMap} from '../types/commonTypes';
import {Zip} from '@awesome-cordova-plugins/zip';
import {ZipPlugin} from 'capacitor-zip';

export type {
  Directory,
  Encoding
} from '@capacitor/filesystem';


export enum FolderType {
  Download,
  Export
}

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


export const dirExists = async (path:string, type: FolderType) => {
  const directory =
    type === FolderType.Download ? Directory.Data :
      type === FolderType.Export ? Directory.Cache :
        undefined;

  const destinationBaseFolder =
    type === FolderType.Download ? OFFLINE_DATADIR_NAME :
      type === FolderType.Export ? EXPORT_DIR_NAME :
        undefined;

  try {
    await Filesystem.readdir({
      directory: directory,
      path: destinationBaseFolder + '/' + path
    });
    return true;
  } catch (e) {
    return false;
  }
};

export const createDirectory = async (path: string, type: FolderType) => {

  const directory = 
    type === FolderType.Download ? Directory.Data :
      type === FolderType.Export ? Directory.Cache :
        undefined;

  const destinationBaseFolder =
    type === FolderType.Download ? OFFLINE_DATADIR_NAME :
      type === FolderType.Export ? EXPORT_DIR_NAME :
        undefined;

  if (directory && destinationBaseFolder) {
    try {
      await Filesystem.mkdir({
        directory: directory,
        path: destinationBaseFolder + '/' + path,
        recursive: true
      });
      return destinationBaseFolder + '/' + path;
    } catch (e) {
      console.error('Error creating folder', e);
    }
  }
};

export const removeDirectory = async (path: string, type: FolderType) => {

  const directory =
    type === FolderType.Download ? Directory.Data :
      type === FolderType.Export ? Directory.Cache :
        undefined;

  const destinationBaseFolder =
    type === FolderType.Download ? OFFLINE_DATADIR_NAME :
      type === FolderType.Export ? EXPORT_DIR_NAME :
        undefined;

  if (directory && destinationBaseFolder) {
    try {
      await Filesystem.rmdir({
        directory: directory,
        path: destinationBaseFolder + '/' + path,
        recursive: true
      });
      return true;
    } catch (e) {
      console.error('Error creating folder', e);
      return false;
    }
  }
};

export const getUri = async (path: string, type: FolderType = FolderType.Download) => {
  const directory =
    type === FolderType.Download ? Directory.Data :
      type === FolderType.Export ? Directory.Cache :
        undefined;
  
  const destinationBaseFolder =
    type === FolderType.Download ? OFFLINE_DATADIR_NAME :
      type === FolderType.Export ? EXPORT_DIR_NAME :
        undefined;
  
  if (directory && destinationBaseFolder) {
    return await Filesystem.getUri({
      directory: directory,
      path: destinationBaseFolder + '/' + path,
    });  
  }
};

export const readFile = async (uri: string) => {
  return await Filesystem.readFile({
    path: uri
  });
};

export const writeFile = async (content: string, path: string, encoding: Encoding = Encoding.UTF8) => {
  return await Filesystem.writeFile({
    path: path,
    data: content,
    directory: Directory.Cache,
    encoding: encoding,
    recursive: true
  });
};

export const copyFilesToDir = async (files: string[], dir: string) => {
  return Promise.all(
    files.map(async file => {
      const filename = file.split('/').pop();
      await Filesystem.copy({from: file, to: dir + '/' + filename, toDirectory: Directory.Cache});
    })
  );
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
  let result;
  const unzipComplete = (resultCode: number) => {
    result = resultCode;
    if (resultCode === 0){
      Filesystem.deleteFile({path: uri});
    } else {
      throw `Error unzipping zip! Path: ${uri}`;
    }
  };
  const filename = uri.split('/').pop() || '';
  const directoryUri = uri.replace(filename, '');
  await Zip.unzip(uri, directoryUri, unzipComplete);
  return result === 0 ? uri.replace('.zip', '') : '';
};

export const deleteFile = async (path:string) => {
  try {
    await Filesystem.deleteFile({
      path
    });
    return true;
  } catch (e) {
    return false;
  }
};

export const generateZip = async (source: string, path: string, fromType: FolderType, toType: FolderType) => {
  const fromDirectory = await getUri(source, fromType);
  const destinationFile = await getUri(path, toType);

  if (destinationFile && fromDirectory) {

    await ZipPlugin.zip({
      source: fromDirectory.uri,
      destination: destinationFile.uri,
      password: ''
    });

    return destinationFile.uri;
  }
};
