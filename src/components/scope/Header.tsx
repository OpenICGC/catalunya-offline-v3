import React, {FC} from 'react';

//MUI
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

//MUI-ICONS
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import RouteIcon from '@mui/icons-material/Route';
import {Theme} from '@mui/material';
import {RGBColor} from '../../types/commonTypes';

export type HeaderProps = {
  name: string,
  color: RGBColor,
  numPoints?: number,
  numPaths?: number,
  onBackButtonClick: () => void
};

const Header: FC<HeaderProps> = ({name, color, numPoints, numPaths, onBackButtonClick}) => {
  
  //STYLES
  const detailsContainerSx = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    ml: 'auto'
  };

  const detailTextSx = {
    color: (theme: Theme) => theme.palette.getContrastText(color),
    ml: 0.5,
    fontWeight: 'bold'
  };

  const detailIconSx = {
    color: (theme: Theme) => theme.palette.getContrastText(color),
    fontSize: '16px',
  };

  const scopeNameSx = {
    color: (theme: Theme) => theme.palette.getContrastText(color),
    width: '125px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontWeight: 500,
    flexGrow: 1,
    ml: 1
  };
  
  return <Box sx={{ flexGrow: 1}}>
    <AppBar position="static" sx={{bgcolor: color || 'secondary.main'}}>
      <Toolbar sx={{px: 1}} disableGutters>
        <ArrowBackIcon sx={{color: theme => theme.palette.getContrastText(color), m: 0, px: 0}} onClick={onBackButtonClick}/>
        <Typography variant="subtitle1" component="h3" sx={scopeNameSx}>{name}</Typography>
        <Box sx={detailsContainerSx}>
          <Typography variant='caption' sx={detailTextSx}>{numPoints || 0}</Typography>
          <LocationOnIcon  fontSize='small' sx={detailIconSx}/>
          <Typography variant='caption' sx={detailTextSx}>{numPaths || 0}</Typography>
          <RouteIcon fontSize='small' sx={detailIconSx}/>
        </Box>
      </Toolbar>
    </AppBar>
  </Box>;
};

export default Header;