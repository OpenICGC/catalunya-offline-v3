import {useCallback} from 'react';
import {ScopePoint} from '../types/commonTypes';
import { Share } from '@capacitor/share';

const useShare = () => {

  const sharePoint = useCallback(async (point: ScopePoint) => {
    const fons = 'naturalMap';
    const lat = point.geometry.coordinates[1].toFixed(5);
    const lng = point.geometry.coordinates[0].toFixed(5);
    const zoom = 16;
    const text = encodeURIComponent(point.properties.name);

    await Share.share({
      url: `https://www.instamaps.cat/visor.html?fons=${fons}&lat=${lat}&lng=${lng}&zoom=${zoom}&text=${text}`
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
