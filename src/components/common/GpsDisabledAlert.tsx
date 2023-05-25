import React, {FC, useCallback, useEffect, useState} from 'react';

import TrackingIcon from '@mui/icons-material/MyLocation';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import {useTranslation} from 'react-i18next';

import AcceptButton from '../buttons/AcceptButton';

//STYLES
const dialogSx = {
  bgcolor: 'secondary.main',
  display: 'flex',
  alignItems: 'center',
  letterSpacing: 1.35
};

const actionsSx = {
  position: 'absolute',
  bottom: 0,
  right: 0
};

const paperProps = {
  sx: {
    height: 'auto',
    pb: 8
  }
};

const trackingIconSx = {mr: 2};

const dialogContentSx = {mt: 2};

export type GpsDisabledAlertProps = {
  isNavigatingToTrack: boolean,
  isNavigatingToPoint: boolean,
  isRecordingTrack: boolean,
  isGeolocationAvailable: boolean
}

const GpsDisabledAlert: FC<GpsDisabledAlertProps> = ({isNavigatingToTrack, isNavigatingToPoint, isRecordingTrack, isGeolocationAvailable}) => {
  const {t} = useTranslation();

  const [isDialogOpen, setDialogOpen] = useState<boolean>(false);

  const showDialog = useCallback(() => setDialogOpen(true), []);
  const hideDialog = useCallback(() => setDialogOpen(false), []);

  useEffect(() => {
    isNavigatingToPoint && !isGeolocationAvailable && showDialog();
  }, [isNavigatingToPoint]);

  useEffect(() => {
    isNavigatingToTrack && !isGeolocationAvailable && showDialog();
  }, [isNavigatingToTrack]);

  useEffect(() => {
    isRecordingTrack && !isGeolocationAvailable && showDialog();
  }, [isRecordingTrack]);

  return isDialogOpen ? <Dialog open={isDialogOpen} onClose={hideDialog} fullWidth PaperProps={paperProps}>
    <DialogTitle sx={dialogSx}>
      <TrackingIcon sx={trackingIconSx}/>
      {t('gpsAlert.title')}
    </DialogTitle>
    <DialogContent sx={dialogContentSx}>
      <Typography>
        {t('gpsAlert.message')}
      </Typography>
    </DialogContent>
    <DialogActions sx={actionsSx}>
      <AcceptButton onAccept={hideDialog}/>
    </DialogActions>
  </Dialog> : null;
};

export default React.memo(GpsDisabledAlert);
