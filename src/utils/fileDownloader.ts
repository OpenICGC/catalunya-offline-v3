
import {FileTransfer, FileTransferError} from '@awesome-cordova-plugins/file-transfer';
import {createDirectory, deleteFile, FolderType, getUri, offlineDirExists, renameFile} from './filesystem';

interface fileDownloader {
  download: () => Promise<string|FileTransferError>,
  cancel: () => void
}



const fileDownloader = (
  url: string, 
  localPath: string, 
  onProgress: (bytes: number) => void): fileDownloader => {
  
  const fileTransfer = FileTransfer.create();
  fileTransfer.onProgress((e) => {
    if (e.lengthComputable) {
      const percentage = e.loaded / e.total * 100;
      if ((percentage % 0.1) < 0.001 ) {
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

    //const absoluteDestinationDirectory = directory?.uri.replace('file://', '') || '';
    const absoluteDestinationDirectory = directory?.uri || '';

    const absolutePath = filename ?
      absoluteDestinationDirectory + '/' + filename :
      absoluteDestinationDirectory + '/' + url.split('/').pop();

    const absoluteTempPath = absolutePath + '.part';
    
    const uri = encodeURI(url);
    
    return fileTransfer
      .download(uri, absoluteTempPath, true)
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