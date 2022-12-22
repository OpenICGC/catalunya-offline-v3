import React, {FC} from 'react';

//MUI
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

//MUI-ICONS
import CloseIcon from '@mui/icons-material/Close';

//UTILS
import {useTranslation} from 'react-i18next';

export type NotificationProps = {
  message: string,
  isPersistent?: boolean,
  isOpen?: boolean,
    variant: 'bottom' | 'center'
    onClose: () => void,
};

const Notification: FC<NotificationProps> = ({
  message, 
  isPersistent= false,
  isOpen= false,
  variant = 'bottom',
  onClose
}) => {
  const {t} = useTranslation();

  //STYLES
  const snackBarContainer = {
    position: variant === 'bottom' ? 'fixed' : 'absolute',
    left: variant === 'bottom' ? '8px' : '50%',
    right: variant === 'bottom' ? '8px' : 'auto',
    bottom: variant === 'bottom' ? '8px' : 'auto',
    top: variant === 'bottom' ? '8px' : '50%',
    transform: variant === 'bottom' ? 'none' : 'translate(-50%, -50%)',
    zIndex: 5000,
    pointerEvents: 'none'
  };

  const snackBarSx = {
    position: variant === 'bottom' ? 'fixed' : 'relative',
    opacity: 0.85,
    '& .MuiSnackbarContent-message': {
      p: 0
    },
    '&.MuiSnackbar-anchorOriginBottomRight': {
      bottom: '8px', 
      right: '8px',
    }
  };

  const containerContent = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  };
  
  return <Stack sx={snackBarContainer}>
    <Snackbar
      open={isOpen}
      autoHideDuration={isPersistent ? null : 6000}
      onClose={onClose}
      message={
        <Box sx={containerContent}>
          <Typography variant='body1' sx={{color: 'primary.contrastText'}}>{t(message)}</Typography>
          {isPersistent ?
            <IconButton onClick={onClose}>
              <CloseIcon sx={{color: 'common.white'}}/>
            </IconButton>
            : null}
        </Box>
      }
      anchorOrigin={{vertical: 'bottom', horizontal: variant === 'bottom' ? 'right' : 'left'}}
      sx={snackBarSx}
    /></Stack>;
};

export default Notification;
