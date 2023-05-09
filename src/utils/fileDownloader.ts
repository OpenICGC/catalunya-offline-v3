
import {FileTransfer, FileTransferError} from '@awesome-cordova-plugins/file-transfer';
import {createDirectory, deleteFile, FolderType, getUri, offlineDirExists, renameFile} from './filesystem';
import {IS_IOS} from '../config';

interface fileDownloader {
  download: () => Promise<string|FileTransferError>,
  cancel: () => void
}



const fileDownloader = (
  url: string, 
  localPath: string, 
  onProgress: (bytes: number) => void): fileDownloader => {

  let lastNotifiedProgress = 0;
  
  const fileTransfer = FileTransfer.create();
  fileTransfer.onProgress((e) => {
    if (e.lengthComputable) {
      if ((e.loaded/e.total) - (lastNotifiedProgress/e.total) >= 0.001 || e.loaded === e.total) {
        // Update progress when difference is bigger than 0.1% for this file, or when done
        lastNotifiedProgress = e.loaded;
        onProgress(e.loaded);
      }
    }
  });
  
  const download = async () => {
    const filename = localPath.split('/').pop() || '';

    const destinationDirectory = filename ?
      localPath.replace(filename, '') :
      localPath;

    if (!(await offlineDirExists(destinationDirectory))){
      await createDirectory(destinationDirectory, FolderType.Download);
    }
    const directory = await getUri(destinationDirectory);

    const absoluteDestinationDirectory = IS_IOS ?
      directory?.uri || '' :
      directory?.uri.replace('file://', '') || '';

    const absolutePath = filename ?
      absoluteDestinationDirectory + '/' + filename :
      absoluteDestinationDirectory + '/' + url.split('/').pop();

    const absoluteTempPath = absolutePath + '.part';
    
    const uri = encodeURI(url);

    lastNotifiedProgress = 0;
    return fileTransfer
      .download(uri, absoluteTempPath, true, {
        headers: {
          'Accept-Encoding': 'identity' // Prevents 'gzip' encoding, giving better bandwidth in our case
        }
      })
      .then(async () => {
        await renameFile(absoluteTempPath, absolutePath);
        //console.debug('[useFileTransfer] Download complete!');
        return absolutePath;
      })
      .catch(async (error) => {
        await deleteFile(absoluteTempPath);
        console.error(`[fileDownloader] Error Downloading ${uri}`);
        return error;
      });
  };
  
  const cancel = () => fileTransfer.abort();
  
  return {
    download,
    cancel
  };  
};

export default fileDownloader;