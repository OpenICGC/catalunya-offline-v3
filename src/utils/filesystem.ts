import {Directory, Encoding, Filesystem} from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import {EXPORT_DIR_NAME, OFFLINE_DATADIR_NAME, PLATFORM} from '../config';
import {BaseMap} from '../types/commonTypes';
import {Zip} from '@awesome-cordova-plugins/zip';
import JSZip from 'jszip';
import {ZipPlugin} from 'capacitor-zip';
 
export type {
  Directory,
  Encoding
} from '@capacitor/filesystem';
 
const safeJoin = (...parts: string[]) => parts.map(p => p.replace(/^\/|\/$/g, '')).join('/');
 
export enum FolderType {
  Download,
  Export
}
 
export const listOfflineDir = async (directory?:string) => {
  try {
    const files = await Filesystem.readdir({
      path: safeJoin(OFFLINE_DATADIR_NAME, directory || ''),
      directory: Directory.Data
    });
    return files.files;
  } catch {
    return [];
  }
};
 
export const offlineDirExists = async (directory:string) => {
  try {
    await Filesystem.stat({
      path: safeJoin(OFFLINE_DATADIR_NAME, directory),
      directory: Directory.Data
    });
    return true;
  } catch {
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
      path: safeJoin(destinationBaseFolder || '', path)
    });
    return true;
  } catch {
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
        path: safeJoin(destinationBaseFolder, path),
        recursive: true
      });
      return safeJoin(destinationBaseFolder, path);
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
        path: safeJoin(destinationBaseFolder, path),
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
      path: safeJoin(destinationBaseFolder, path),
    });
  }
};
export const getUriAndroid = async (path: string, type: FolderType = FolderType.Download) => {
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
 
export const renameFile = async (from: string, to: string) => {
  return await Filesystem.rename({
    from: from,
    to: to
  });
};
 
export const writeFile = async (content: string, path: string, encoding: Encoding = Encoding.UTF8) => {
  if (PLATFORM === 'ios') {
    return await Filesystem.writeFile({
      path: path,
      data: content,
      directory: Directory.Cache,
      encoding: encoding
    });
  } else {
    return await Filesystem.writeFile({
      path: path,
      data: content,
      directory: Directory.Cache,
      encoding: encoding,
      recursive: true
    });
  }
};
 
/*export const copyFilesToDir = async (files: string[], dir: string) => {
  return Promise.all(
    files.map(async file => {
      const filename = file.split('/').pop();
      await Filesystem.copy({from: file, to: safeJoin(dir, filename || ''), toDirectory: Directory.Cache});
    })
  );
};*/
export const copyFilesToDir = async (files: string[], dir: string) => {
  const platform = Capacitor.getPlatform();
  console.log('Platform detected:', platform);

  return Promise.all(
    files.map(async file => {
      console.log('Processing file:', file);
      const filename = file.split('/').pop();
      console.log('Extracted filename:', filename);
      if (!filename) {
        console.error('No filename found for file:', file);
        return;
      }

      if (platform === 'ios') {
        console.log('[iOS] Copying file from:', file, 'to:', safeJoin(dir, filename));
        try {
          const result = await Filesystem.copy({
            from: file,
            to: safeJoin(dir, filename),
            directory: Directory.Cache
          });
          console.log('[iOS] Copy success:', result);
          return result;
        } catch (e) {
          console.error('[iOS] Copy failed:', e);
        }
      } else if (platform === 'android') {
        let relativePath: string = file;
        console.log('[Android] Original file path:', file);

        if (file.startsWith('http://localhost/_capacitor_file_')) {
          const match = file.match(/\/files\/(.+)$/);
          relativePath = match ? match[1] : '';
          console.log('[Android] Extracted relativePath:', relativePath);
        }

        if (!relativePath) {
          console.error('[Android] Invalid relativePath for file:', file);
          return;
        }

        console.log('[Android] Copying file from:', relativePath, 'directory:', Directory.Data, 'to:', safeJoin(dir, filename));
        try {
          const result = await Filesystem.copy({
            from: relativePath,
            directory: Directory.Data,
            to: safeJoin(dir, filename),
            toDirectory: Directory.Cache
          });
          console.log('[Android] Copy success:', result);
          return result;
        } catch (e) {
          console.error('[Android] Copy failed:', e);
        }
      } else {
        console.warn('Platform not supported for copyFilesToDir:', platform);
        return;
      }
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
  return new Promise<string>((resolve, reject) => {
    const unzipComplete = (resultCode: number) => {
      if (resultCode === 0) {
        Filesystem.deleteFile({path: uri}).then(() => resolve(uri.replace('.zip', '')));
      } else {
        reject(`Error unzipping zip! Path: ${uri}`);
      }
    };
    const filename = uri.split('/').pop() || '';
    const directoryUri = uri.replace(filename, '');
    Zip.unzip(uri, directoryUri, unzipComplete);
  });
 
 
};
 
export const deleteFile = async (path:string) => {
  try {
    await Filesystem.deleteFile({
      path
    });
    return true;
  } catch {
    return false;
  }
};
export const generateZip = async (
  source: string,
  path: string,
  fromType: FolderType,
  toType: FolderType
) => {
  const platform = Capacitor.getPlatform(); // 'ios' | 'android' | 'web'

 

  

  try {
    if (platform === 'ios') {
      const fromDirectory = await getUri(source, fromType);
      const toDirectory = toType === FolderType.Export ? Directory.Cache : Directory.Data;
      
      
      if (!fromDirectory?.uri) {
        console.error('Invalid source URI');
        return undefined;
      }

      // iOS: usar JSZip per fer zip manualment
      const files = await Filesystem.readdir({
        path: fromDirectory.uri.replace('file://', ''),
        directory: undefined
      });

      const zip = new JSZip();

      for (const file of files.files) {
        if (file.type !== 'file') continue;

        const filePath = safeJoin(EXPORT_DIR_NAME, source, file.name);
        const fileContent = await Filesystem.readFile({
          path: filePath,
          directory: Directory.Cache
        });

        zip.file(file.name, fileContent.data, { base64: true });
      }

      const zipped = await zip.generateAsync({ type: 'base64' });

      await Filesystem.writeFile({
        path: safeJoin(EXPORT_DIR_NAME, path),
        data: zipped,
        directory: toDirectory
      });

      const finalPath = await getUri(path, toType);
      return finalPath?.uri;

    } else if (platform === 'android') {
      const fromDirectory = await getUriAndroid(source, fromType);
      const destinationFile = await getUriAndroid(path, toType);

      console.log('android** zip', fromDirectory, destinationFile);
      // Android: usar ZipPlugin natiu
      if (destinationFile && fromDirectory) {
        await ZipPlugin.zip({
          source: fromDirectory.uri,
          destination: destinationFile.uri,
          password: '' // Android necessita string buida si no hi ha password
        });

        return destinationFile.uri;
      }
    } else {
      console.warn('Unsupported platform android**:', platform);
      return undefined;
    }
  } catch (err) {
    console.error('Error zipping files: android**', err);
    return undefined;
  }
};
/*export const generateZip = async (source: string, path: string, fromType: FolderType, toType: FolderType) => {
  
  const fromDirectory = await getUri(source, fromType);
  const toDirectory = toType === FolderType.Export ? Directory.Cache : Directory.Data;
  
  if (!fromDirectory?.uri) {
    console.error('Invalid source URI');
    return undefined;
  }
 
  try {
    const files = await Filesystem.readdir({
      path: fromDirectory.uri.replace('file://', ''),
      directory: undefined
    });
    
    const zip = new JSZip();
    
    for (const file of files.files) {
      if (file.type !== 'file') continue;
      const filePath = safeJoin(EXPORT_DIR_NAME, source, file.name);
      
      const fileContent = await Filesystem.readFile({
        path: filePath,
        directory: Directory.Cache
      });
     
      zip.file(file.name, fileContent.data, { base64: true });
    }
 
    const zipped = await zip.generateAsync({ type: 'base64' });
 
    await Filesystem.writeFile({
      path: safeJoin(EXPORT_DIR_NAME, path),
      data: zipped,
      directory: toDirectory
    });
 
    const finalPath = await getUri(path, toType);
    return finalPath?.uri;
  } catch (err) {
    console.error('Error zipping files:', err);
    return undefined;
  }
};*/
 
export const onlineFileSize = async (url: string) => {
  const response = await fetch(url, {
    headers: { 'Accept-Encoding': 'identity' }, // Prevents 'gzip' encoding, giving better bandwidth in our case, and ensures getting content-length header
    method: 'HEAD'
  });
  const size = response.headers.get('content-length');
  if (size) {
    return parseInt(size);
  } else {
    return undefined;
  }
};
 
export const bytesToSize = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return 'n/a';
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), sizes.length - 1);
  if (i === 0) return `${bytes} ${sizes[i]}`;
  return `${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`;
};