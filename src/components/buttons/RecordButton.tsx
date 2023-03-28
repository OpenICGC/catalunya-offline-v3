import React, {FC} from 'react';

//MUI
import Button from '@mui/material/Button';

//MUI-ICONS
import RecordIcon from '@mui/icons-material/FiberManualRecord';

//UTILS
import {useTranslation} from 'react-i18next';
import useIsLargeSize from '../../hooks/settings/useIsLargeSize';

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
    onClick: () => void
}

const RecordButton: FC<RecordButtonProps> = ({
  onClick
}) => {
  const {t} = useTranslation();
  const [isLargeSize] = useIsLargeSize();

  const size = isLargeSize ? 'large' : 'medium';
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
