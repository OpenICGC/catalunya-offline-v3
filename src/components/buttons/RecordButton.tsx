import React, {FC} from 'react';

//MUI
import Button from '@mui/material/Button';

//MUI-ICONS
import RecordIcon from '@mui/icons-material/FiberManualRecord';

//UTILS
import {useTranslation} from 'react-i18next';

const recButtonSx = {
  bgcolor: 'grey.700',
  '&:hover': {
    bgcolor: 'grey.800'
  },
  '& .MuiSvgIcon-root': {
    color: '#d32f2f'
  }
};

export interface RecordButtonProps {
    isAccessibleSize: boolean,
    onClick: () => void
}

const RecordButton: FC<RecordButtonProps> = ({
  isAccessibleSize,
  onClick
}) => {
  const {t} = useTranslation();
  const size = isAccessibleSize ? 'large' : 'medium';
  const handleClick = () => onClick();

  return <Button
    variant='contained'
    size={size}
    startIcon={<RecordIcon/>}
    onClick={handleClick}
    sx={recButtonSx}
  >
    {t('actions.rec')}
  </Button>;
};

export default RecordButton;
