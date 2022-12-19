import {Directory, Filesystem} from '@capacitor/filesystem';
import {OFFLINE_DATADIR_NAME} from '../config';

export const readFiles = async (directory?:string) => {
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
  const file = await Filesystem.readFile({
    path: uri
  });
  return file;
};

