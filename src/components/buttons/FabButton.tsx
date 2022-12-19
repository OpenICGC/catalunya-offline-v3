import React, {FC, useState} from 'react';

//MUI
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import IconButton from '@mui/material/IconButton';
import {SxProps} from '@mui/system';


//MUI-ICONS
import AddIcon from '@mui/icons-material/Add';
import CompassIcon from '../icons/Compass';
import FolderIcon from '@mui/icons-material/Folder';
import LayersIcon from '@mui/icons-material/Layers';
import MapIcon from '@mui/icons-material/Map';
import TrackingIcon from '@mui/icons-material/MyLocation';
import NoTrackingIcon from '@mui/icons-material/LocationSearching';
import LocationDisabledIcon from '@mui/icons-material/LocationDisabled';

//STYLES
const fabTransition = 'transform 360ms linear';
const buttonTransition = 'transform 360ms cubic-bezier(0.16, 1, 0.3, 1)';
const delay = 40; // ms

export type FabButtonProps = {
  isLeftHanded: boolean,
  isAccessibleSize: boolean,
  bearing: number,
  isCompassOn: boolean,
  isLocationAvailable: boolean,
  isTrackingOn: boolean,
  onCompassClick: () => void,
  onTrackingClick: () => void,
  onLayersClick: () => void,
  onBaseMapsClick: () => void,
  onFoldersClick: () => void
};

const FabButton: FC<FabButtonProps> = ({isLeftHanded= false, isAccessibleSize=false, bearing=0, isCompassOn=false, isLocationAvailable, isTrackingOn=false, onCompassClick, onTrackingClick, onLayersClick, onBaseMapsClick, onFoldersClick}) => {
  const [isMenuOpen, setMenuOpen] = useState(false);

  //STYLES
  const fabSize = isAccessibleSize ? 72 : 56;
  const buttonSize = isAccessibleSize ? 50 : 40;
  const iconSize = isAccessibleSize ? 32 : undefined;
  const radius = isAccessibleSize ? 80 : 60;

  const container: SxProps = {
    height: '100%',
    width: 0,
    padding: 0,
    position: 'absolute',
    right: isLeftHanded ? undefined : 8 + fabSize,
    left: isLeftHanded ? 8 : undefined
  };

  const greyButton = {
    bgcolor: 'grey.800',
    '&:hover': {
      bgcolor: 'grey.800',
    },
  };

  const common = {
    top: 0,
    bottom: 0,
    left: (fabSize - buttonSize) / 2,
    right: 'auto',
    margin: 'auto',
    position: 'absolute',
    width: buttonSize,
    height: buttonSize,
    boxShadow: 5,
    transition: buttonTransition,
    '& .MuiSvgIcon-root': {
      fontSize: iconSize
    },
    zIndex: 1000
  };

  const compass = {
    ...common,
    ...greyButton,
    transitionDelay: `${0 * delay}ms`
  };

  const compassOpen = {
    ...compass,
    bgcolor: isCompassOn ? 'primary.main' : 'grey.800',
    '&:hover': {
      bgcolor: isCompassOn ? 'primary.main' : 'grey.800',
    },
    transform: `translate(0px, -${radius}px)`,
    transitionDelay: `${4 * delay}ms`
  };

  const location = {
    ...common,
    ...greyButton,
    transitionDelay: `${1 * delay}ms`
  };

  const locationOpen = {
    ...location,
    bgcolor: isLocationAvailable ? isTrackingOn ? 'primary.main' : 'grey.800' : 'grey.400',
    '&:hover': {
      bgcolor: isLocationAvailable ? isTrackingOn ? 'primary.main' : 'grey.800' : 'grey.400',
    },
    transform: isLeftHanded ? `translate(${radius * 0.707}px, -${radius * 0.707}px)` : `translate(-${radius * 0.707}px, -${radius * 0.707}px)`,
    transitionDelay: `${3 * delay}ms`
  };

  const layers = {
    ...common,
    ...greyButton,
    transitionDelay: `${2 * delay}ms`
  };

  const layersOpen = {
    ...layers,
    ...greyButton,
    transform: isLeftHanded ? `translate(${radius}px, 0px)` : `translate(-${radius}px, 0px)`,
    transitionDelay: `${2 * delay}ms`
  };

  const baseMaps = {
    ...common,
    ...greyButton,
    transitionDelay: `${3 * delay}ms`
  };

  const baseMapsOpen = {
    ...baseMaps,
    ...greyButton,
    transform: isLeftHanded ? `translate(${radius * 0.707}px, ${radius * 0.707}px)` : `translate(-${radius * 0.707}px, ${radius * 0.707}px)`,
    transitionDelay: `${1 * delay}ms`
  };

  const folder = {
    ...common,
    ...greyButton,
    transitionDelay: `${4 * delay}ms`
  };

  const folderOpen = {
    ...folder,
    ...greyButton,
    transform: `translate(0px, ${radius}px)`,
    transitionDelay: `${0 * delay}ms`
  };

  const fab = {
    bgcolor: isMenuOpen ? 'primary.main' : 'grey.800',
    '&:hover': {
      bgcolor: isMenuOpen ? 'primary.main' : 'grey.800',
    },
    width: fabSize,
    height: fabSize,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    margin: 'auto',
    position: 'absolute',
    zIndex: 1001,
    transition: fabTransition
  };
  const fabOpen = {
    ...fab,
    transform: 'rotate(45deg)'
  };

  return <Box sx={container}>
    <Fab color='primary' sx={isMenuOpen ? fabOpen : fab} onClick={() => setMenuOpen(!isMenuOpen)}>
      <AddIcon sx={{color: isMenuOpen ? 'grey.800' : 'common.white', fontSize: fabSize / 2}}/>
    </Fab>
    <IconButton sx={isMenuOpen ? compassOpen : compass} onClick={onCompassClick}>
      <CompassIcon sx={{color: 'common.white', transform: `rotate(${-45 - bearing}deg)`, fontSize: iconSize}}/>
    </IconButton>
    <IconButton sx={isMenuOpen ? layersOpen : layers} onClick={onLayersClick}>
      <LayersIcon sx={{color: 'common.white'}}/>
    </IconButton>
    <IconButton sx={isMenuOpen ? folderOpen : folder} onClick={onFoldersClick}>
      <FolderIcon sx={{color: 'common.white'}}/>
    </IconButton>
    <IconButton sx={isMenuOpen ? baseMapsOpen : baseMaps} onClick={onBaseMapsClick}>
      <MapIcon sx={{color: 'common.white'}}/>
    </IconButton>
    <IconButton sx={isMenuOpen ? locationOpen : location} onClick={onTrackingClick}>
      {
        isLocationAvailable ?
          isTrackingOn ? <TrackingIcon sx={{color: 'grey.800'}}/>
            : <NoTrackingIcon sx={{color: 'common.white'}}/>
          : <LocationDisabledIcon sx={{color: 'common.white'}}/>
      }
    </IconButton>
  </Box>;
};

export default FabButton;
