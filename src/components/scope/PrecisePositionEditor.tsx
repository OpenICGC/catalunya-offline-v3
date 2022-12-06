import React, {FC} from 'react';

//MUI
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

//MUI-ICONS
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

//CATOFFLINE
import ManagerHeader from '../common/ManagerHeader';
import PrecisePosition from '../icons/PrecisePosition';

//UTILS
import {useTranslation} from 'react-i18next';
import {Theme} from '@mui/material';
import {HEXColor} from '../../types/commonTypes';
import useTheme from '@mui/material/styles/useTheme';

export type PrecisePositionEditorProps = {
  isAccessibleSize: boolean,
  name: string,
  color?: HEXColor,
  onAccept: () => void,
  onCancel: () => void,
}

const PrecisePositionEditor: FC<PrecisePositionEditorProps> = ({
  isAccessibleSize,
  name,
  color,
  onAccept,
  onCancel
}) => {
  const {t} = useTranslation();
  const theme = useTheme();
  const handleAccept = () => onAccept();
  const handleCancel = () => onCancel();

  const crosshairSize = 80;

  const precisePositionIcon = {
    pointerEvents: 'none', 
    width: `${crosshairSize}px`,
    height: `${crosshairSize}px`,
    color: 'black',
    opacity: 0.67
  };
  
  const buttonsContainer = {
    position: 'absolute', 
    bottom: '8px',
    left: 0,
    py: 1,
    zIndex: 1000, 
    width: '100vw'
  };
  
  const buttonsPosition = {
    flexDirection: 'row', 
    justifyContent: 'center',
    gap: 2,
    width: '100%'
  };
  
  const cancelButton = {
    bgcolor: 'common.white', 
    color: 'error.main', 
    borderColor: (theme: Theme) => theme.palette.error.main,
    minWidth: '120px',
    '&:hover': {
      bgcolor: 'common.white',
      borderColor: (theme: Theme) => theme.palette.error.main
    }
  };
  
  const acceptButton = {
    color: 'common.white', 
    bgcolor: 'success.main', 
    minWidth: '120px',
    '&:hover': {
      bgcolor: 'success.main',
    }
  };

  const headerName = (name ? `${name.toUpperCase()} - ` : '') + t('actions.addPoint');
  const headerColor = color ? color : theme.palette.secondary.main;

  return <>
    <Stack sx={{position: 'absolute', top: 0, width: '100%'}}>
      <ManagerHeader name={headerName} color={headerColor} startIcon={<AddLocationAltIcon/>}/>
    </Stack>
    <Stack sx={{position: 'absolute', top: `calc(50% - ${crosshairSize/2}px)`, left: `calc(50% - ${crosshairSize/2}px)`, width: 0, height: 0}}>
      <PrecisePosition sx={precisePositionIcon}/>
    </Stack>
    <Stack direction='row' sx={buttonsContainer}>
      <Stack sx={buttonsPosition}>
        <Button size={isAccessibleSize ? 'large' : 'medium'} startIcon={<CancelIcon/>} variant='outlined' 
          sx={cancelButton}
          onClick={handleCancel}>{t('actions.cancel')}</Button>
        <Button size={isAccessibleSize ? 'large' : 'medium'} startIcon={<CheckCircleIcon/>} variant='contained' 
          sx={acceptButton}
          onClick={handleAccept}
        >{t('actions.accept')}</Button>
      </Stack>
    </Stack>
  </>;
};

export default PrecisePositionEditor;