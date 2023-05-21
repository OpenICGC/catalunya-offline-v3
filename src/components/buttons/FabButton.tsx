import React, {FC} from 'react';

//MUI
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import IconButton from '@mui/material/IconButton';
import {SxProps} from '@mui/system/styleFunctionSx/styleFunctionSx';
import grey from '@mui/material/colors/grey';


//MUI-ICONS
import FabIcon from '@mui/icons-material/Add';
import OrientationIcon from '../icons/Compass';
import LocationDisabledIcon from '@mui/icons-material/LocationDisabled';
import NoTrackingIcon from '@mui/icons-material/LocationSearching';
import TrackingIcon from '@mui/icons-material/MyLocation';
import LayersIcon from '@mui/icons-material/Layers';
import NavigationIcon from '../icons/NavigationIcon';
import BaseMapsIcon from '@mui/icons-material/Map';
import ScopesIcon from '@mui/icons-material/Folder';
import useIsLargeSize from '../../hooks/settings/useIsLargeSize';
import useIsLeftHanded from '../../hooks/settings/useIsLeftHanded';

//STYLES
const fabTransition = 'transform 360ms linear';
const buttonTransition = 'transform 360ms cubic-bezier(0.16, 1, 0.3, 1)';
const delay = 40; // ms

export enum LOCATION_STATUS {
  DISABLED,
  NOT_TRACKING,
  TRACKING,
  NAVIGATING
}

export type FabButtonProps = {
  isFabOpen: boolean,
  isFabHidden: boolean,
  onFabClick: () => void,
  bearing: number,
  pitch: number,
  locationStatus: LOCATION_STATUS,
  onOrientationClick: () => void,
  onLocationClick: () => void,
  onLayersClick: () => void,
  onBaseMapsClick: () => void,
  onScopesClick: () => void
}

const FabButton: FC<FabButtonProps> = ({
  isFabOpen,
  isFabHidden,
  onFabClick ,
  bearing = 0,
  pitch = 0,
  locationStatus,
  onOrientationClick,
  onLocationClick,
  onLayersClick,
  onBaseMapsClick,
  onScopesClick
}) => {

  const [isLargeSize] = useIsLargeSize();
  const [isLeftHanded] = useIsLeftHanded();

  //STYLES
  const fabSize = isLargeSize ? 72 : 56;
  const buttonSize = isLargeSize ? 50 : 40;
  const iconSize = isLargeSize ? 32 : undefined;
  const radius = isLargeSize ? 80 : 60;

  const container: SxProps = {
    height: '100%',
    width: 0,
    padding: 0,
    position: 'absolute',
    right: isLeftHanded ? undefined : 8 + fabSize,
    left: isLeftHanded ? 8 : undefined
  };

  const buttonBase = {
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
    zIndex: 1000,
    bgcolor: 'grey.800',
    '&:hover': {
      bgcolor: 'grey.800'
    },
    '& .MuiSvgIcon-root': {
      fontSize: iconSize,
      color: 'common.white'
    }
  };

  const orientationBgcolor = bearing == 0 && pitch == 0 ? 'grey.800' : 'primary.main';
  const orientationIconColor = 'common.white';
  const orientationNorthColor = bearing == 0 && pitch == 0 ? '#800' : '#C00';
  const orientationSouthColor = grey[800];

  const orientation = {
    ...buttonBase,
    transitionDelay: `${0 * delay}ms`,
    bgcolor: orientationBgcolor,
    opacity: !isFabOpen ? 0 : 1,
    '&:hover': {
      bgcolor: orientationBgcolor
    },
    '& .MuiSvgIcon-root': {
      fontSize: iconSize,
      transform: `rotate(${-45 - bearing}deg)`, // `rotateX(${pitch}deg) rotate(${-45 - bearing}deg)`,
      color: orientationIconColor
    },
  };

  const orientationOpen = {
    ...orientation,
    transform: `translate(0px, -${radius}px)`,
    transitionDelay: `${4 * delay}ms`
  };

  const locationBgcolor =
    locationStatus === LOCATION_STATUS.DISABLED ? 'grey.400' :
      locationStatus === LOCATION_STATUS.NOT_TRACKING ? 'grey.800' :
        'primary.main';

  const location = {
    ...buttonBase,
    transitionDelay: `${1 * delay}ms`,
    bgcolor: locationBgcolor,
    opacity: !isFabOpen ? 0 : 1,
    '&:hover': {
      bgcolor: locationBgcolor
    }
  };

  const locationOpen = {
    ...location,
    transform: isLeftHanded ? `translate(${radius * 0.707}px, -${radius * 0.707}px)` : `translate(-${radius * 0.707}px, -${radius * 0.707}px)`,
    transitionDelay: `${3 * delay}ms`
  };

  const layers = {
    ...buttonBase,
    transitionDelay: `${2 * delay}ms`,
    opacity: !isFabOpen ? 0 : 1
  };

  const layersOpen = {
    ...layers,
    transform: isLeftHanded ? `translate(${radius}px, 0px)` : `translate(-${radius}px, 0px)`,
    transitionDelay: `${2 * delay}ms`
  };

  const baseMaps = {
    ...buttonBase,
    transitionDelay: `${3 * delay}ms`,
    opacity: !isFabOpen ? 0 : 1
  };

  const baseMapsOpen = {
    ...baseMaps,
    transform: isLeftHanded ? `translate(${radius * 0.707}px, ${radius * 0.707}px)` : `translate(-${radius * 0.707}px, ${radius * 0.707}px)`,
    transitionDelay: `${1 * delay}ms`
  };

  const folder = {
    ...buttonBase,
    transitionDelay: `${4 * delay}ms`,
    opacity: !isFabOpen ? 0 : 1
  };

  const folderOpen = {
    ...folder,
    transform: `translate(0px, ${radius}px)`,
    transitionDelay: `${0 * delay}ms`
  };

  const fab = {
    width: fabSize,
    height: fabSize,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    margin: 'auto',
    position: 'absolute',
    zIndex: 1001,
    transition: fabTransition,
    bgcolor: 'primary.main',
    '&:hover': {
      bgcolor: 'primary.main'
    },
    '& .MuiSvgIcon-root': {
      fontSize: fabSize / 2,
    }
  };

  const fabOpen = {
    ...fab,
    transform: 'rotate(45deg)'
  };

  const fabHidden = {
    ...fab,
    transform: isLeftHanded ? 'translateX(-100px)' : 'translateX(100px)'
  };

  return <Box sx={container}>
    <Fab color="primary" sx={isFabOpen ? fabOpen : isFabHidden ? fabHidden : fab} onClick={onFabClick}>
      <FabIcon/>
    </Fab>
    <IconButton sx={isFabOpen ? orientationOpen : orientation} onClick={onOrientationClick}>
      <OrientationIcon northColor={orientationNorthColor} southColor={orientationSouthColor}/>
    </IconButton>
    <IconButton sx={isFabOpen ? layersOpen : layers} onClick={onLayersClick}>
      <LayersIcon/>
    </IconButton>
    <IconButton sx={isFabOpen ? folderOpen : folder} onClick={onScopesClick}>
      <ScopesIcon/>
    </IconButton>
    <IconButton sx={isFabOpen ? baseMapsOpen : baseMaps} onClick={onBaseMapsClick}>
      <BaseMapsIcon/>
    </IconButton>
    <IconButton sx={isFabOpen ? locationOpen : location} onClick={onLocationClick}>
      {
        locationStatus === LOCATION_STATUS.DISABLED ? <LocationDisabledIcon/> :
          locationStatus === LOCATION_STATUS.NOT_TRACKING ? <NoTrackingIcon/> :
            locationStatus === LOCATION_STATUS.TRACKING ? <TrackingIcon/> :
              <NavigationIcon/>
      }
    </IconButton>
  </Box>;
};

export default React.memo(FabButton);
