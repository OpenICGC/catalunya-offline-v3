import React, {FC, useCallback, useEffect, useState} from 'react';
import usePointNavigation from '../../hooks/singleton/usePointNavigation';
import useTrackNavigation from '../../hooks/singleton/useTrackNavigation';
import useGeolocation from '../../hooks/singleton/useGeolocation';
import useRecordingTrack from '../../hooks/singleton/useRecordingTrack';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import DialogActions from '@mui/material/DialogActions';
import AcceptButton from '../buttons/AcceptButton';

import Dialog from '@mui/material/Dialog';
import TrackingIcon from '@mui/icons-material/MyLocation';
import {useTranslation} from 'react-i18next';

//STYLES
const dialogSx = {
  bgcolor: 'secondary.main',
  display: 'flex',
  alignItems: 'center',
  letterSpacing: 1.35
};

const GpsDisabledAlert: FC = () => {
  const {t} = useTranslation();
  const pointNavigation = usePointNavigation();
  const trackNavigation = useTrackNavigation();
  const {geolocation} = useGeolocation();
  const recordingTrack = useRecordingTrack();

  const [isDialogOpen, setDialogOpen] = useState<boolean>(false);

  const showDialog = useCallback((condition: boolean) => setDialogOpen(condition && !geolocation.latitude && !geolocation.longitude), [geolocation.latitude, geolocation.longitude]);

  const handleAccept = useCallback(() => setDialogOpen(false), []);

  useEffect(() => {
    showDialog(pointNavigation.target !== undefined);
  }, [pointNavigation.target]);

  useEffect(() => {
    showDialog(trackNavigation.target !== undefined);
  }, [trackNavigation.target]);

  useEffect(() => {
    showDialog(recordingTrack.isRecording);
  }, [recordingTrack.isRecording]);

  return isDialogOpen ? <Dialog open={isDialogOpen} onClose={handleAccept} fullWidth PaperProps={{sx: {height: 'auto', pb: 8}}}>
    <DialogTitle sx={dialogSx}>
      <TrackingIcon sx={{mr: 2}}/>
      {t('gpsAlert.title')}
    </DialogTitle>
    <DialogContent sx={{mt: 2}}>
      <Typography>
        {t('gpsAlert.message')}
      </Typography>
    </DialogContent>
    <DialogActions sx={{position: 'absolute', bottom: 0, right: 0}}>
      <AcceptButton onAccept={handleAccept}/>
    </DialogActions>
  </Dialog> : null;
};

export default React.memo(GpsDisabledAlert);