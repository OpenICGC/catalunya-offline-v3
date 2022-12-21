import React, {FC} from 'react';

import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import Button from '@mui/material/Button';
import {useTranslation} from 'react-i18next';

export interface TrackRecButtonProps {
    isAccessibleSize: boolean,
    onRecStart: () => void,
}

const TrackRecButton: FC<TrackRecButtonProps> = ({
  isAccessibleSize,
  onRecStart
}) => {

  const {t} = useTranslation();

  const recButtonSx = {
    bgcolor: 'grey.700',
    '&:hover': {
      bgcolor: 'grey.800'
    }
  };

  return <Button
    variant='contained'
    size={isAccessibleSize ? 'large' : 'medium'}
    startIcon={<FiberManualRecordIcon sx={{color: '#d32f2f'}}/>}
    onClick={() => onRecStart()}
    sx={recButtonSx}
  >
    {t('actions.rec')}
  </Button>;
};

export default TrackRecButton;