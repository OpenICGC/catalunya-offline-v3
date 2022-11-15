import React from 'react';
import PropTypes from 'prop-types';

//MUI
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

//MUI-ICONS
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import RouteIcon from '@mui/icons-material/Route';
import Box from '@mui/material/Box';

const Header = ({name, color, numPoints, numPaths, onBackButtonClick}) => {
  
  //STYLES
  const appBarSx = {
    display: 'flex',
    flexFlow: 'row noWrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
    bgcolor: color || 'secondary.main',
    pl: 2,
    height: '54px'
  };

  const detailsContainerSx = {
    display: 'flex',
    alignItems: 'center',
    ml: 'auto',
    mr: 1
  };

  const detailTextSx = {
    color: theme => theme.palette.getContrastText(color),
    fontWeight: 'bold',
    ml: 1
  };

  const detailIconSx = {
    color: theme => theme.palette.getContrastText(color),
    fontSize: '20px',
  };

  const scopeNameSx = {
    color: theme => theme.palette.getContrastText(color),
    mt: 0.5,
    width: '250px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  };
  
  return <AppBar variant='dense' position="static" sx={appBarSx}>
    <DoubleArrowIcon sx={{transform: 'rotate(180deg)', color: theme => theme.palette.getContrastText(color)}} onClick={onBackButtonClick}/>
    <Toolbar sx={{display: 'flex', justifyContent: 'baseline'}}>
      <Typography variant="h5" sx={scopeNameSx}>{name}</Typography>
    </Toolbar>
    <Box sx={detailsContainerSx}>
      <Typography variant='body1' sx={detailTextSx}>{numPoints || 0}</Typography>
      <LocationOnIcon  sx={detailIconSx}/>
      <Typography variant='body1' sx={detailTextSx}>{numPaths || 0}</Typography>
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