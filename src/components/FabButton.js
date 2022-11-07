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
import LocationSearchingIcon from '@mui/icons-material/LocationSearching';
import MapIcon from '@mui/icons-material/Map';

//STYLES
import { red } from '@mui/material/colors';
import {darken } from '@mui/material';

const fabWidth = 72;
const buttonDiameter = 40;
const buttonRadio = buttonDiameter/2;
const globalDiameter = 180;
const globalRadio = globalDiameter/2;
const container = {
/*
  top: '50vh',
  right: 8,*/
  position: 'absolute',
  height: globalDiameter,
  width: globalDiameter,
  borderRadius: '100%',
  margin: 5,
};

const FabButton = ({leftHanded, onExploreClick, onLocationClick, onLayersClick, onBaseMapsClick, onFoldersClick}) => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  //STYLES
  const fabStyle = {
    width: fabWidth,
    height: fabWidth,
    position: 'absolute',
    left: globalRadio-(fabWidth/2),
    top: globalRadio-(fabWidth/2),
  };
  const commonButtonStyle = {
    visibility: isMenuOpen ? 'visible' : 'hidden',
    width: buttonDiameter,
    height: buttonDiameter,
    position: 'absolute',
    boxShadow: 5,
  };
  const greyButtonsStyle = {
    bgcolor: 'grey.800',
    '&:hover': {
      bgcolor: 'grey.900',
    },
  };
  const exploreButton = {
    ...commonButtonStyle,
    ...greyButtonsStyle,
    left: globalRadio-buttonRadio,
    top: 0
  };
  const locationButton = {
    ...commonButtonStyle,
    ...greyButtonsStyle,
    top: (globalRadio*(Math.sqrt(2)-1))/Math.sqrt(2)-(buttonRadio*(Math.sqrt(2)-1))/Math.sqrt(2),
    left: leftHanded ? 'none' : (globalRadio*(Math.sqrt(2)-1))/Math.sqrt(2)-(buttonRadio*(Math.sqrt(2)-1))/Math.sqrt(2),
    right: leftHanded ? (globalRadio*(Math.sqrt(2)-1))/Math.sqrt(2)-(buttonRadio*(Math.sqrt(2)-1))/Math.sqrt(2) : 'none',
  };
  const layersButton = {
    ...commonButtonStyle,
    bgcolor: red[500],
    '&:hover': {
      bgcolor: darken(red[500], 0.2),
    },
    top: globalRadio-buttonRadio,
    left: leftHanded ? globalDiameter-buttonDiameter : 0
  };
  const baseMapsButton = {
    ...commonButtonStyle,
    bgcolor: 'tertiary.main',
    '&:hover': {
      bgcolor: 'tertiary.dark',
    },
    left: leftHanded ? 'none' : (globalRadio*(Math.sqrt(2)-1))/Math.sqrt(2)-(buttonRadio*(Math.sqrt(2)-1))/Math.sqrt(2),
    right: leftHanded ? (globalRadio*(Math.sqrt(2)-1))/Math.sqrt(2)-(buttonRadio*(Math.sqrt(2)-1))/Math.sqrt(2) : 'none',
    bottom: (globalRadio*(Math.sqrt(2)-1))/Math.sqrt(2)-(buttonRadio*(Math.sqrt(2)-1))/Math.sqrt(2),
  };
  const folderButton = {
    ...commonButtonStyle,
    bgcolor: 'secondary.main',
    '&:hover': {
      bgcolor: 'secondary.dark',
    },
    left: globalRadio-buttonRadio,
    top: globalDiameter-buttonDiameter,
  };
  return <>
    <Box sx={container} onMouseLeave={() => setMenuOpen(false)}>
      <IconButton sx={exploreButton} onClick={() => onExploreClick()}><ExploreIcon sx={{color: 'common.white'}}/></IconButton>
      <IconButton sx={locationButton} onClick={() => onLocationClick()}><LocationSearchingIcon sx={{color: 'common.white'}}/></IconButton>
      <IconButton sx={layersButton} onClick={() => onLayersClick()}><LayersIcon sx={{color: 'grey.800'}}/></IconButton>
      <IconButton sx={baseMapsButton} onClick={() => onBaseMapsClick()}><MapIcon sx={{color: 'grey.800'}}/></IconButton>
      <IconButton sx={folderButton} onClick={() => onFoldersClick()}><FolderIcon sx={{color: 'grey.800'}}/></IconButton>
      <Fab color='primary' sx={fabStyle} onMouseEnter={() => setMenuOpen(true)} onClick={() => setMenuOpen(true)}>
        <AddIcon sx={{color: 'grey.800', fontSize: fabWidth/2}}/>
      </Fab>
    </Box>
  </>;
};

FabButton.propTypes = {
  leftHanded: PropTypes.bool,
  onExploreClick: PropTypes.func,
  onLocationClick: PropTypes.func,
  onLayersClick: PropTypes.func,
  onBaseMapsClick: PropTypes.func,
  onFoldersClick: PropTypes.func
};

FabButton.defaultProps = {
  leftHanded: false,
};

export default FabButton;