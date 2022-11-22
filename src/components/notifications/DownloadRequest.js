import React from 'react';
import PropTypes from 'prop-types';

//MUI
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';

//MUI-ICONS
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import MapIcon from '@mui/icons-material/Map';

//UTILS
import {useTranslation} from 'react-i18next';

const DownloadRequest = ({isOpen, onClose, onDownload}) => {
  const {t} = useTranslation();
  return <Dialog open={isOpen} onClose={onClose} fullWidth>
    <DialogTitle sx={{display: 'flex', alignItems: 'center', letterSpacing: 1.35}}>
      <MapIcon sx={{mr: 1}}/>
      {t('downloadingAlert.title')}
    </DialogTitle>
    <Divider/>
    <DialogContent>
      <DialogContentText gutterBottom sx={{color: 'text.secondary', textAlign: 'justify'}}>
        {t('downloadingAlert.content_01')}
      </DialogContentText>
      <DialogContentText gutterBottom sx={{color: 'text.secondary', textAlign: 'justify'}}>
        {t('downloadingAlert.content_02')}
      </DialogContentText>
      <DialogContentText gutterBottom sx={{color: 'text.primary', textAlign: 'justify'}}>
        {t('downloadingAlert.content_03')}
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button startIcon={<CancelIcon/>} onClick={onClose} sx={{color: 'text.secondary'}}>{t('actions.cancel')}</Button>
      <Button startIcon={<CheckCircleIcon/>} onClick={onDownload}>{t('actions.accept')}</Button>
    </DialogActions>
  </Dialog>;
};

DownloadRequest.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onDownload: PropTypes.func
};

DownloadRequest.defaultProps = {
  isOpen: false
};

export default DownloadRequest;
