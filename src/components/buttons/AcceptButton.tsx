import React, {FC} from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Button from '@mui/material/Button';
import {useTranslation} from 'react-i18next';

export interface AcceptButtonProps {
  isAccessibleSize: boolean,
    variant?: 'text' | 'outlined' | 'contained',
    onAccept: () => void
}

const AcceptButton: FC<AcceptButtonProps> = ({
  isAccessibleSize,
  variant = 'text',
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
  
  return <Button size={isAccessibleSize ? 'large' : 'medium'} startIcon={<CheckCircleIcon/>} variant={variant}
    sx={acceptButton}
    onClick={() => onAccept()}
  >{t('actions.accept')}</Button>;
};

export default AcceptButton;