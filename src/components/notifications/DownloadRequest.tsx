import React, {FC} from 'react';

//MUI
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';

//MUI-ICONS
import MapIcon from '@mui/icons-material/Map';

//CATOFFLINE
import CancelButton from '../buttons/CancelButton';
import AcceptButton from '../buttons/AcceptButton';

//UTILS
import {useTranslation} from 'react-i18next';
import {bytesToSize} from '../../utils/filesystem';

export type DownloadRequestProps = {
  isOpen: boolean,
  onClose: () => void,
  onDownload: () => void,
  bytes: number
};

const DownloadRequest: FC<DownloadRequestProps> = ({isOpen= false, onClose, onDownload, bytes}) => {
  const {t} = useTranslation();
  return <Dialog open={isOpen} onClose={onClose} fullWidth>
    <DialogTitle sx={{display: 'flex', alignItems: 'center', letterSpacing: 1.05, bgcolor: 'secondary.main'}}>
      <MapIcon sx={{mr: 1}}/>
      {t('downloadingAlert.title')}
    </DialogTitle>
    <Divider/>
    <DialogContent>
      <DialogContentText gutterBottom sx={{color: 'text.secondary'}}>
        {t('downloadingAlert.content_01')}
      </DialogContentText>
      <DialogContentText gutterBottom sx={{color: 'text.primary'}}>
        {t('downloadingAlert.content_02', {pendingSize: bytesToSize(bytes)})}
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <CancelButton onCancel={onClose}/>
      <AcceptButton onAccept={onDownload}/>
    </DialogActions>
  </Dialog>;
};

export default DownloadRequest;
