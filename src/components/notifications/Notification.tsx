import React, {FC} from 'react';
import PropTypes from 'prop-types';

//MUI
import Snackbar from '@mui/material/Snackbar';

//MUI-ICONS
import CloseIcon from '@mui/icons-material/Close';

//UTILS
import {useTranslation} from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

//STYLES
const container = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
};

const sx = {
  '&.MuiSnackbar-anchorOriginBottomRight': {
    '@media (min-width: 0px) and (orientation: landscape)': {
      maxWidth: '50vw'
    },
    bottom: '8px', right: '8px',
  }
};

export type NotificationProps = {
  message: string,
  isPersistent?: boolean,
  isOpen?: boolean,
  onClose: () => void,
};

const Notification: FC<NotificationProps> = ({message, isPersistent, isOpen, onClose}) => {
  const {t} = useTranslation();
  return <Snackbar
    open={isOpen}
    autoHideDuration={isPersistent ? null : 6000}
    onClose={onClose}
    message={
      <Box sx={container}>
        <Typography variant='body1' sx={{color: 'primary.contrastText'}}>{t(message)}</Typography>
        {onClose ?
          <IconButton onClick={onClose}>
            <CloseIcon sx={{color: 'common.white'}}/>
          </IconButton>
          : null}
      </Box>
    }
    anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
    sx={sx}
  />;
};

Notification.propTypes = {
  message: PropTypes.string.isRequired,
  isPersistent: PropTypes.bool,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired
};

Notification.defaultProps = {
  isPersistent: false,
  isOpen: false
};

export default Notification;
