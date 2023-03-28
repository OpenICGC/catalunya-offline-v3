import React, {FC} from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Button from '@mui/material/Button';
import {useTranslation} from 'react-i18next';
import useIsLargeSize from '../../hooks/settings/useIsLargeSize';

export interface AcceptButtonProps {
    variant?: 'text' | 'outlined' | 'contained',
    disabled?: boolean
    onAccept: () => void,
}

const AcceptButton: FC<AcceptButtonProps> = ({
  variant = 'text',
  disabled= false,
  onAccept
}) => {
    
  const {t} = useTranslation();
  const [isLargeSize] = useIsLargeSize();
  const acceptButton = {
    color: variant === 'contained' ? 'common.white' : undefined,
    minWidth: '120px',
    '&:hover': {
      bgcolor: variant === 'contained' && 'primary.main',
    }
  };
  
  return <Button 
    size={isLargeSize ? 'large' : 'medium'}
    startIcon={<CheckCircleIcon/>} 
    variant={variant}
    disabled={disabled}
    sx={acceptButton}
    onClick={() => onAccept()}
  >
    {t('actions.accept')}
  </Button>;
};

export default AcceptButton;