import React, {FC, useEffect, useMemo, useState} from 'react';
import {UUID} from '../../../types/commonTypes';
import ShareDialog, {FEATURE_SHARED, SHARE_FORMAT} from '../../common/ShareDialog';
import HandleExportCompressed from './HandleExportCompressed';
import useShare from '../../../hooks/useShare';
import ProgressDialog from '../../common/ProgressDialog';
import HandleExportGpx from './HandleExportGpx';


export type HandleExportProps = {
  scopeId: UUID,
  trackId?: UUID,
  onSharedStarted: () => void,
  onSharedCancel: () => void
}

type HandleExportState = {
  format: SHARE_FORMAT,
  shareVisiblePoints: boolean
}

const HandleExport: FC<HandleExportProps> = ({
  scopeId,
  trackId,
  onSharedStarted,
  onSharedCancel
}) => {

  const [state, setState] = useState<HandleExportState|undefined>(undefined);
  const [filePath, setFilePath] = useState<string|undefined>(undefined);

  const {shareFile} = useShare();

  const handleShareDialogOptionsSelected = (format: SHARE_FORMAT, shareVisiblePoints = false) => {
    setState({format: format, shareVisiblePoints: shareVisiblePoints});
  };

  useEffect(() => {
    if (filePath) {
      shareFile(filePath);
      onSharedStarted();
    }
  }, [filePath]);
  
  const ExportLogicComponent = useMemo(() => {
    if (state) {
      if (state.format === SHARE_FORMAT.GPX && trackId) {
        return <HandleExportGpx
          scopeId={scopeId}
          trackId={trackId}
          onFileReady={setFilePath} />;
      } else {
        return <HandleExportCompressed 
          type={state.format}
          scopeId={scopeId}
          trackId={trackId}
          onFileReady={setFilePath}
        />;
      }
    }
  }, [state]);

  return state ?
    <>
      <ProgressDialog />
      {ExportLogicComponent}
    </>  
    :
    <ShareDialog
      featureShared={trackId ? FEATURE_SHARED.TRACK : FEATURE_SHARED.SCOPE}
      isAccesibleSize={false}
      onClick={handleShareDialogOptionsSelected}
      onCancel={onSharedCancel}
    />;
};

export default HandleExport;