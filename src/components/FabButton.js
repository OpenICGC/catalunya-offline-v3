import React, {useState} from 'react';
import PropTypes from 'prop-types';

//MUI
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import IconButton from '@mui/material/IconButton';

//MUI-ICONS
import AddIcon from '@mui/icons-material/Add';
import CompassIcon from './icons/Compass';
import FolderIcon from '@mui/icons-material/Folder';
import LayersIcon from '@mui/icons-material/Layers';
import LocationDisabledIcon from '@mui/icons-material/LocationDisabled';
import LocationSearchingIcon from '@mui/icons-material/LocationSearching';
import MapIcon from '@mui/icons-material/Map';
import MyLocationIcon from '@mui/icons-material/MyLocation';

//STYLES
const fabTransition = 'transform 360ms linear';
const buttonTransition = 'translate 360ms cubic-bezier(0.16, 1, 0.3, 1)';
const delay = 40; // ms

const FabButton = ({isLeftHanded, isAccessibleSize, bearing, isCompassOn, isLocationAvailable, isTrackingOn,  onCompassClick, onTrackingClick, onLayersClick, onBaseMapsClick, onFoldersClick}) => {
  const [isMenuOpen, setMenuOpen] = useState(false);

  //STYLES
  const fabSize = isAccessibleSize ? 72 : 56;
  const buttonSize = isAccessibleSize ? 56 : 40;
  const iconSize = isAccessibleSize ? 36 : undefined;
  const radius = isAccessibleSize ? 90 : 60;

  const container = {
    height: '100%',
    width: fabSize,
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
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    margin: 'auto',
    position: 'absolute',
    width: buttonSize,
    height: buttonSize,
    boxShadow: 5,
    transition: buttonTransition,
    '& .MuiSvgIcon-root': {
      fontSize: iconSize
    }
  };
  
  const compass = {
    ...common,
    ...greyButton,
    transitionDelay: `${0*delay}ms`
  };

  const compassOpen = {
    ...compass,
    bgcolor: isCompassOn ? 'primary.main' : 'grey.800',
    '&:hover': {
      bgcolor: isCompassOn ? 'primary.dark' :'grey.900',
    },
    translate: `0px -${radius}px`,
    transitionDelay: `${4*delay}ms`
  };

  const location = {
    ...common,
    ...greyButton,
    transitionDelay: `${1*delay}ms`
  };

  const locationOpen = {
    ...location,
    bgcolor: isLocationAvailable? isTrackingOn ? 'primary.main' : 'grey.800' : 'action.disabled',
    '&:hover': {
      bgcolor: isTrackingOn ? 'primary.dark' :'grey.900',
    },
    translate: isLeftHanded ? `${radius*0.707}px -${radius*0.707}px` : `-${radius*0.707}px -${radius*0.707}px`,
    transitionDelay: `${3*delay}ms`
  };

  const layers = {
    ...common,
    ...greyButton,
    transitionDelay: `${2*delay}ms`
  };

  const layersOpen = {
    ...layers,
    ...greyButton,
    translate: isLeftHanded ? `${radius}px 0px` : `-${radius}px 0px`,
    transitionDelay: `${2*delay}ms`
  };

  const baseMaps = {
    ...common,
    ...greyButton,
    transitionDelay: `${3*delay}ms`
  };

  const baseMapsOpen = {
    ...baseMaps,
    ...greyButton,
    translate: isLeftHanded ? `${radius*0.707}px ${radius*0.707}px` : `-${radius*0.707}px ${radius*0.707}px`,
    transitionDelay: `${1*delay}ms`
  };

  const folder = {
    ...common,
    ...greyButton,
    transitionDelay: `${4*delay}ms`
  };

  const folderOpen = {
    ...folder,
    ...greyButton,
    translate: `0px ${radius}px`,
    transitionDelay: `${0*delay}ms`
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
    zIndex: 5000,
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
      <CompassIcon sx={{color: 'common.white', transform: `rotate(${-45+bearing}deg)`, fontSize: iconSize}}/>
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
          isTrackingOn ? <MyLocationIcon sx={{color: 'grey.800'}}/>
            : <LocationSearchingIcon sx={{color: 'common.white'}}/>
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
  bearing: 0,
  isCompassOn: false,
  isTrackingOn: false
};

export default FabButton;
