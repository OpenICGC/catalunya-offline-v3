import React, {FC} from 'react';
import CancelIcon from '@mui/icons-material/Cancel';
import Button from '@mui/material/Button';
import {Theme} from '@mui/material';
import {useTranslation} from 'react-i18next';

export interface CancelButtonProps {
 isAccessibleSize: boolean,
    variant?: 'text' | 'outlined' | 'contained',
    disabled?: boolean
 onCancel: () => void
}

const greyColor = 700;

const CancelButton: FC<CancelButtonProps> = ({
  isAccessibleSize,
  variant = 'text',
  disabled= false,
  onCancel
}) => {
    
  const {t} = useTranslation();

  const cancelButton = {
    bgcolor: variant === 'contained' ? 'common.white' : undefined,
    color: `grey.${greyColor}`,
    borderColor: (theme: Theme) => variant === 'contained' ? theme.palette.grey[greyColor] : undefined,
    minWidth: '120px',
    '&:hover': {
      bgcolor: variant === 'contained' ? 'common.white' : 'transparent',
      borderColor: (theme: Theme) => variant === 'contained' ? theme.palette.grey[greyColor] : undefined
    }
  };
  
  return <Button 
    size={isAccessibleSize ? 'large' : 'medium'} 
    startIcon={<CancelIcon sx={{color: `grey.${greyColor}`}}/>}
    variant={variant}
    disabled={disabled}
    sx={cancelButton}
    onClick={() => onCancel()}>{t('actions.cancel')}</Button>;
};

export default CancelButton;