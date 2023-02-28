import {FC, useEffect} from 'react';
import {UUID} from '../../../types/commonTypes';
import {useGpx} from '../../../hooks/useGpx';


type HandleExportGpxProps = {
  scopeId: UUID,
  trackId: UUID,
  includeVisiblePoints?: boolean
  onFileReady: (filePath: string) => void
}

const HandleExportGpx: FC<HandleExportGpxProps> = ({
  scopeId,
  trackId,
  includeVisiblePoints,
  onFileReady
}) => {

  const path = useGpx({scopeId, trackId, includeVisiblePoints});

  useEffect(() => {
    if (path) onFileReady(path);
  }, [path]);

  return null;
};

export default HandleExportGpx;