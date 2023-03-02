import React, {FC} from 'react';

//MUI
import Stack from '@mui/material/Stack';

//MUI-ICONS
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';

//CATOFFLINE
import Header from '../common/Header';
import PrecisePosition from '../icons/PrecisePosition';

//UTILS
import {useTranslation} from 'react-i18next';
import {HEXColor} from '../../types/commonTypes';
import useTheme from '@mui/material/styles/useTheme';
import CancelButton from '../buttons/CancelButton';
import AcceptButton from '../buttons/AcceptButton';


export type PositionEditorProps = {
  name?: string,
  color?: HEXColor,
  onAccept: () => void,
  onCancel: () => void,
}

const PositionEditor: FC<PositionEditorProps> = ({
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
  
  const headerName = (name ? `${name.toUpperCase()} - ` : '') + t('actions.addPoint');
  const headerColor = color ? color : (theme.palette.secondary.main as HEXColor);

  return <>
    <Stack sx={{position: 'absolute', top: 0, width: '100%'}}>
      <Header name={headerName} color={headerColor} startIcon={<AddLocationAltIcon/>}/>
    </Stack>
    <Stack sx={{position: 'absolute', top: `calc(50% - ${crosshairSize/2}px)`, left: `calc(50% - ${crosshairSize/2}px)`, width: 0, height: 0}}>
      <PrecisePosition sx={precisePositionIcon}/>
    </Stack>
    <Stack direction='row' sx={buttonsContainer}>
      <Stack sx={buttonsPosition}>
        <CancelButton onCancel={handleCancel} variant='contained'/>
        <AcceptButton onAccept={handleAccept} variant='contained'/>
      </Stack>
    </Stack>
  </>;
};

export default PositionEditor;
