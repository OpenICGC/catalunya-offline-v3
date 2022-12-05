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
import {Scope} from '../../types/commonTypes';
import {useTranslation} from 'react-i18next';
import {Theme} from '@mui/material';

export type PrecisePositionEditorProps = {
    isAccessibleSize: boolean,
    isLeftHanded: boolean,
    scope: Scope,
    viewport: {
        latitude: number,
        longitude: number,
        zoom: number,
        bearing: number,
        pitch: number
    }
  onAccept: (coords: Array<number>) => void,
  onCancel: () => void,
}

const PrecisePositionEditor: FC<PrecisePositionEditorProps> = ({
  isAccessibleSize,
  isLeftHanded,
  scope,
  viewport,
  onAccept,
  onCancel
}) => {
  
  const {t} = useTranslation();
  const handleAccept = () => onAccept && onAccept([viewport.latitude, viewport.longitude]);
  const handleCancel = () => onCancel && onCancel();
  
  const precisePositionIcon = {
    pointerEvents: 'none', 
    width: '20vw', 
    height: '20vw', 
    maxWidth: '100px', 
    maxHeight: '100px', 
    color: 'grey.600'
  };
  
  const buttonsContainer = {
    position: 'absolute', 
    bottom: 40, 
    left: 0, 
    py: 2, 
    zIndex: 1000, 
    width: '100vw', 
    gap: 2,
    '@media (min-width: 0px) and (orientation: landscape)': {
      bottom: 0,
      px: 2
    }
  };
  
  const buttonsPosition = {
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    width: '100%',
    '@media (min-width: 0px) and (orientation: landscape)': {
      justifyContent: isLeftHanded ? 'flex-end' : 'flex-start',
    }
  };
  
  const cancelButton = {
    bgcolor: 'common.white', 
    color: 'error.main', 
    borderColor: (theme: Theme) => theme.palette.error.main, minWidth: '150px',
    '&:hover': {
      bgcolor: 'common.white',
      borderColor: (theme: Theme) => theme.palette.error.main
    },
    '@media (min-width: 0px) and (orientation: landscape)': {
      mr: 2,
    }
  };
  
  const acceptButton = {
    color: 'common.white', 
    bgcolor: 'success.main', 
    minWidth: '150px',
    '&:hover': {
      bgcolor: 'success.main',
    }
  };
  
  return <>
    <Stack sx={{position: 'absolute', top: 0, width: '100%'}}>
      <ManagerHeader name={`${scope.name.toUpperCase()} > Añadir punto`} color='#ffd300' startIcon={<AddLocationAltIcon/>}/>
    </Stack>
    <Stack sx={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
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