import React, {FC} from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Button from '@mui/material/Button';
import {useTranslation} from 'react-i18next';

export interface AcceptButtonProps {
  isAccessibleSize: boolean,
    variant?: 'text' | 'outlined' | 'contained',
    disabled?: boolean
    onAccept: () => void,
}

const AcceptButton: FC<AcceptButtonProps> = ({
  isAccessibleSize,
  variant = 'text',
  disabled= false,
  onAccept
}) => {
    
  const {t} = useTranslation();
    
  const acceptButton = {
    color: variant === 'contained' ? 'common.white' : undefined,
    minWidth: '120px',
    '&:hover': {
      bgcolor: variant === 'contained' && 'primary.main',
    }
  };
  
  return <Button 
    size={isAccessibleSize ? 'large' : 'medium'} 
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