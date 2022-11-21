import React from 'react';
import PropTypes from 'prop-types';

//MUI
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

//MUI-ICONS
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import RouteIcon from '@mui/icons-material/Route';


const Header = ({name, color, numPoints, numPaths, onBackButtonClick}) => {
  
  //STYLES
  const appBarSx = {
    display: 'flex',
    flexFlow: 'row noWrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
    bgcolor: color || 'secondary.main',
    pl: 0.5,
    height: '54px',
  };

  const toolbarSx = {
    px: 1,
    display: 'flex',
    justifyContent: 'baseline',
  };

  const detailsContainerSx = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    ml: 'auto',
    mr: 1,
  };

  const detailTextSx = {
    color: theme => theme.palette.getContrastText(color),
    ml: 0.5,
    fontWeight: 'bold'
  };

  const detailIconSx = {
    color: theme => theme.palette.getContrastText(color),
    fontSize: '16px',
  };

  const scopeNameSx = {
    color: theme => theme.palette.getContrastText(color),
    width: '125px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontWeight: 500
  };
  
  return <AppBar position="static" sx={appBarSx}>
    <ArrowBackIcon sx={{color: theme => theme.palette.getContrastText(color), m: 0, px: 0}} onClick={onBackButtonClick}/>
    <Toolbar sx={toolbarSx}>
      <Typography variant="subtitle1" component='h3' sx={scopeNameSx}>{name}</Typography>
    </Toolbar>
    <Box sx={detailsContainerSx}>
      <Typography variant='caption' sx={detailTextSx}>{numPoints || 0}</Typography>
      <LocationOnIcon  fontSize='small' sx={detailIconSx}/>
      <Typography variant='caption' sx={detailTextSx}>{numPaths || 0}</Typography>
      <RouteIcon fontSize='small' sx={detailIconSx}/>
    </Box>
  </AppBar>;
};

Header.propTypes = {
  color: PropTypes.string,
  name: PropTypes.string.isRequired,
  numPoints: PropTypes.number,
  numPaths: PropTypes.number,
  onBackButtonClick: PropTypes.func
};

export default Header;