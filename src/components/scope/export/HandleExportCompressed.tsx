import {FC, useEffect} from 'react';
import {UUID} from '../../../types/commonTypes';
import {SHARE_FORMAT} from '../../common/ShareDialog';
import {useZip} from '../../../hooks/useZip';


type HandleExportCompressedProps = {
  type: SHARE_FORMAT,
  scopeId: UUID,
  trackId?: UUID,
  includeVisiblePoints?: boolean
  onFileReady: (filePath: string) => void
}

const HandleExportCompressed: FC<HandleExportCompressedProps> = ({
  type,
  scopeId,
  trackId,
  includeVisiblePoints,
  onFileReady
}) => {

  const path = useZip({type, scopeId, trackId, includeVisiblePoints});

  useEffect(() => {
    if (path) onFileReady(path);
  }, [path]);

  return null;
};

export default HandleExportCompressed;