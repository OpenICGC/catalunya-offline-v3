import React, {FC} from 'react';

//MUI
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Snackbar, {SnackbarOrigin} from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';

//MUI-ICONS
import CancelIcon from '@mui/icons-material/Cancel';
import CloseIcon from '@mui/icons-material/Close';

//UTILS
import {useTranslation} from 'react-i18next';

//STYLES
const container = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  mb:1
};

const progressContainer = {
  display: 'flex',
  alignItems: 'center'
};

const snackbarContent = {
  display: 'inline',
  '& .MuiSnackbarContent-action': {
    justifyContent: 'flex-end'
  }
};

const sx = {
  '&.MuiSnackbar-anchorOriginBottomRight': {
    '@media (min-width: 0px) and (orientation: landscape)': {
      maxWidth: '50vw'
    },
    bottom: '8px', right: '8px',
  }
};

const anchorOrigin: SnackbarOrigin = {vertical: 'bottom', horizontal: 'right'};

export type DownloadProgressProps = {
  progress: number,
  isOpen?: boolean,
  onClose?: () => void,
  onCancel?: () => void,
  description: string
};

const DownloadProgress: FC<DownloadProgressProps>  = ({progress, isOpen=false, onClose, description, onCancel}) => {
  const {t} = useTranslation();
  return <Snackbar
    open={isOpen}
    onClose={onClose}
    anchorOrigin={anchorOrigin}
    sx={sx}>
    <SnackbarContent
      sx={snackbarContent}
      message={<>
        <Box sx={container}>
          <Typography variant='body1' sx={{color: 'primary.contrastText'}}>{t('actions.downloading')}</Typography>
          {onClose && <IconButton onClick={onClose}>
            <CloseIcon sx={{color: 'common.white'}}/>
          </IconButton>}
        </Box>
        <Typography variant='body2' sx={{mb: 0.5, color: 'primary.contrastText'}}>{description}</Typography>
        <Box sx={progressContainer}>
          <Box sx={{ width: '100%', mr: 1 }}>
            <LinearProgress variant="determinate" value={progress}/>
          </Box>
          <Typography variant="body2" color="primary.contrastText">{progress}%</Typography>
        </Box>
        { onCancel && <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2}}>
          <Button startIcon={<CancelIcon sx={{color: 'primary.contrastText', float: 'left'}}/>} onClick={onCancel} sx={{color: 'primary.contrastText', pb: 0}}>{t('actions.cancel')}</Button>
        </Box>}
      </>}
    />
  </Snackbar>;
};

export default DownloadProgress;
