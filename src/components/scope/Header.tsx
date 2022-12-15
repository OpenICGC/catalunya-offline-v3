import React, {FC} from 'react';

//MUI
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

//MUI-ICONS
import ArrowBackIcon from '@mui/icons-material/DoubleArrow';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import RouteIcon from '@mui/icons-material/Route';

//UTILS
import {Theme} from '@mui/material';
import {HEXColor} from '../../types/commonTypes';

export type HeaderProps = {
  name: string,
  color: HEXColor,
  numPoints?: number,
  numTracks?: number,
  onBackButtonClick: () => void
};

//STYLES
const toolbarSx = {
  px: 1,
  display: 'flex',
  justifyContent: 'baseline',
  pl: 1.5,
  pr: 1.5,
  '@media (min-width: 600px)': {
    pl: 1.5,
    pr: 1.5
  }
};

const backIconSx = {
  transform: 'rotate(180deg)'
};

const detailsContainerSx = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  ml: 'auto'
};

const Header: FC<HeaderProps> = ({name, color, numPoints, numTracks, onBackButtonClick}) => {

  const appBarSx = {
    bgcolor: color || 'secondary.main',
    height: '48px',
    '& .MuiSvgIcon-root': {
      color: (theme: Theme) => theme.palette.getContrastText(color)
    }
  };

  const scopeNameSx = {
    color: (theme: Theme) => theme.palette.getContrastText(color),
    width: '125px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontWeight: 500,
    lineHeight: 1,
    flexGrow: 1,
    pl: 1.5
  };

  const detailTextSx = {
    color: (theme: Theme) => theme.palette.getContrastText(color),
    ml: 0.5,
    fontWeight: 'bold'
  };

  const detailIconSx = {
    color: (theme: Theme) => theme.palette.getContrastText(color)
  };

  const handleBackButtonClick = () => onBackButtonClick();

  return <Box>
    <AppBar position="static" sx={appBarSx} elevation={0}>
      <Toolbar variant="dense" sx={toolbarSx}>
        <ArrowBackIcon sx={backIconSx} onClick={handleBackButtonClick}/>
        <Typography variant="subtitle1" component="h3" sx={scopeNameSx}>{name}</Typography>
        <Box sx={detailsContainerSx}>
          <Typography variant="caption" sx={detailTextSx}>{numPoints || 0}</Typography>
          <LocationOnIcon fontSize="small" sx={detailIconSx}/>
          <Typography variant="caption" sx={detailTextSx}>{numTracks || 0}</Typography>
          <RouteIcon fontSize="small" sx={detailIconSx}/>
        </Box>
      </Toolbar>
    </AppBar>
  </Box>;
};

export default Header;