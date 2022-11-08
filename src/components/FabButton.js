import React, {useState} from 'react';
import PropTypes from 'prop-types';

//MUI
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import IconButton from '@mui/material/IconButton';

//MUI-ICONS
import AddIcon from '@mui/icons-material/Add';
import ExploreIcon from '@mui/icons-material/Explore';
import FolderIcon from '@mui/icons-material/Folder';
import LayersIcon from '@mui/icons-material/Layers';
import LocationDisabledIcon from '@mui/icons-material/LocationDisabled';
import LocationSearchingIcon from '@mui/icons-material/LocationSearching';
import MapIcon from '@mui/icons-material/Map';
import MyLocationIcon from '@mui/icons-material/MyLocation';

//STYLES
import red from '@mui/material/colors/red';
import {darken} from '@mui/system/colorManipulator';

const transitionOpen = 'translate 0.3s linear, opacity 0.5s linear';
const transitionClose = 'translate 0.1s linear, opacity 0.1s linear';
const delay = '100';

const FabButton = ({isLeftHanded, isAccessibleSize, bearing, isCompassOn, isLocationAvailable, isTrackingOn,  onCompassClick, onTrackingClick, onLayersClick, onBaseMapsClick, onFoldersClick}) => {
  const [isMenuOpen, setMenuOpen] = useState(false);

  //STYLES
  const fabWidth = isAccessibleSize ? 72 : 56;
  const buttonWidth = isAccessibleSize ? 56 : 40;
  const radio = isAccessibleSize ? 80 : 60;
  
  const container = {
    height: '100%',
    width: fabWidth,
    position: 'absolute',
    right: isLeftHanded ? undefined : 8,
    left: isLeftHanded ? 8 : undefined,
    padding: 0
  };
  const greyButton = {
    bgcolor: 'grey.800',
    '&:hover': {
      bgcolor: 'grey.900',
    },
  };
  const common = {
    right: 0,
    left: 0,
    margin: 'auto',
    top: 0,
    bottom: 0,
    position: 'absolute',
    width: buttonWidth,
    height: buttonWidth,
    boxShadow: 5,
    opacity: 0
  };
  
  const compass = {
    ...common,
    ...greyButton,
    transition: transitionClose,
  };
  const compassOpen = {
    ...common,
    ...greyButton,
    translate: `0px -${radio}px`,
    transition: transitionOpen,
    opacity: 1,

  };

  const location = {
    ...common,
    ...greyButton,
    transition: transitionClose,
  };
  const locationOpen = {
    ...common,
    ...greyButton,
    translate: isLeftHanded ? `${radio*0.707}px -${radio*0.707}px` : `-${radio*0.707}px -${radio*0.707}px` ,
    transition: transitionOpen,
    opacity: 1,
    transitionDelay: `${1*delay}ms`
  };

  const layers = {
    ...common,
    bgcolor: red[500],
    '&:hover': {
      bgcolor: darken(red[500], 0.2),
    },
    transition: transitionClose,
  };
  const layersOpen = {
    ...common,
    bgcolor: red[500],
    '&:hover': {
      bgcolor: darken(red[500], 0.2),
    },
    translate: isLeftHanded ? `${radio}px 0px` : `-${radio}px 0px` ,
    transition: transitionOpen,
    opacity: 1,
    transitionDelay: `${2*delay}ms`
  };

  const baseMaps = {
    ...common,
    bgcolor: 'tertiary.main',
    '&:hover': {
      bgcolor: 'tertiary.dark',
    },
    transition: transitionClose,
    opacity: 1,
  };
  const baseMapsOpen = {
    ...common,
    bgcolor: 'tertiary.main',
    '&:hover': {
      bgcolor: 'tertiary.dark',
    },
    translate: isLeftHanded ? `${radio*0.707}px ${radio*0.707}px` : `-${radio*0.707}px ${radio*0.707}px`,
    transition: transitionOpen,
    opacity: 1,
    transitionDelay: `${3*delay}ms`
  };

  const folder = {
    ...common,
    bgcolor: 'secondary.main',
    '&:hover': {
      bgcolor: 'secondary.dark',
    },
    transition: transitionClose,
    opacity: 1,
  };
  const folderOpen = {
    ...common,
    bgcolor: 'secondary.main',
    '&:hover': {
      bgcolor: 'secondary.dark',
    },
    translate: `0px ${radio}px`,
    transition: transitionOpen,
    opacity: 1,
    transitionDelay: `${4*delay}ms`
  };

  const fabCommon = {
    width: fabWidth,
    height: fabWidth,
    right: 0,
    left: 0,
    margin: 'auto',
    top: 0,
    bottom: 0,
    position: 'absolute',
    zIndex: 5000,
    transition: 'transform 0.3s linear',
  };

  const fab = {
    ...fabCommon,
  };
  const fabOpen = {
    ...fabCommon,
    transform: 'rotate(45deg)'
  };

  return <Box sx={container}>
    <Fab color='primary' sx={isMenuOpen ? fabOpen : fab} onClick={() => setMenuOpen(!isMenuOpen)}>
      <AddIcon sx={{color: 'grey.800', fontSize: fabWidth / 2}}/>
    </Fab>
    <IconButton sx={isMenuOpen ? compassOpen : compass} onClick={() => onCompassClick()}>
      <ExploreIcon sx={{color: isCompassOn ? 'primary.main' : 'common.white', transform: `rotate(${-45+bearing}deg)`}}/>
    </IconButton>
    <IconButton sx={isMenuOpen ? layersOpen : layers} onClick={() => onLayersClick()}>
      <LayersIcon sx={{color: 'grey.800'}}/>
    </IconButton>
    <IconButton sx={isMenuOpen ? folderOpen : folder} onClick={() => onFoldersClick()}>
      <FolderIcon sx={{color: 'grey.800'}}/>
    </IconButton>
    <IconButton sx={isMenuOpen ? baseMapsOpen : baseMaps} onClick={() => onBaseMapsClick()}>
      <MapIcon sx={{color: 'grey.800'}}/>
    </IconButton>
    <IconButton sx={isMenuOpen ? locationOpen : location} onClick={() => onTrackingClick()}>
      {
        isLocationAvailable ?
          isTrackingOn ? <MyLocationIcon sx={{color: 'primary.main'}}/> : <LocationSearchingIcon sx={{color: 'common.white'}}/>
          : <LocationDisabledIcon sx={{color: 'common.white'}}/>
      }
    </IconButton>
  </Box>;
};

FabButton.propTypes = {
  isLeftHanded: PropTypes.bool,
  isAccessibleSize: PropTypes.bool,
  bearing: PropTypes.number,
  isCompassOn: PropTypes.bool,
  isLocationAvailable: PropTypes.bool.isRequired,
  isTrackingOn: PropTypes.bool,
  onCompassClick: PropTypes.func,
  onTrackingClick: PropTypes.func,
  onLayersClick: PropTypes.func,
  onBaseMapsClick: PropTypes.func,
  onFoldersClick: PropTypes.func
};

FabButton.defaultProps = {
  isLeftHanded: false,
  isAccessibleSize: false,
  bearing: 0
};

export default FabButton;