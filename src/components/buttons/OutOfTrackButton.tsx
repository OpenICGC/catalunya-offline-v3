import React from 'react';

import {useTranslation} from 'react-i18next';
import Typography from '@mui/material/Typography';

const OutOfTrackButton = () => {
    
  const {t} = useTranslation();
    
  //STYLES
  const alertOutOfTrackSx = {
    textTransform: 'upperCase',
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    left: '50%',
    top: '50%',
    bgcolor: 'error.light',
    color: 'common.white',
    py: 0.5,
    px: 2,
    opacity: 0.85,
    borderRadius: 2,
    border: 1,
    borderColor: 'error.light',
  };

  return <Typography variant='caption' sx={alertOutOfTrackSx}>
    {t('trackAlert.outOfTrack')}
  </Typography>;
};

export default OutOfTrackButton;