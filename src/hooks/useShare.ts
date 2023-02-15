import {useCallback} from 'react';
import {ScopePoint} from '../types/commonTypes';
import { Share } from '@capacitor/share';


const useShare = () => {

  const sharePoint = useCallback(async (point: ScopePoint) => {
    await Share.share({
      url: `https://www.openstreetmap.org/?mlat=${point.geometry.coordinates[1]}&mlon=${point.geometry.coordinates[0]}`
    });
  }, []);

  const shareFile = useCallback(async (filePath: string) => {
    await Share.share({
      files: [filePath]
    });
  }, []);

  return {
    sharePoint,
    shareFile
  };
};

export default useShare;
