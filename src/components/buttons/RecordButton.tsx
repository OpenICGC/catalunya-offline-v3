import React, {FC} from 'react';

//MUI
import Button from '@mui/material/Button';

//MUI-ICONS
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

//UTILS
import {useTranslation} from 'react-i18next';

export interface RecordButtonProps {
    isAccessibleSize: boolean,
    onClick: () => void
}

const RecordButton: FC<RecordButtonProps> = ({
  isAccessibleSize,
  onClick
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
    onClick={onClick}
    sx={recButtonSx}
  >
    {t('actions.rec')}
  </Button>;
};

export default RecordButton;