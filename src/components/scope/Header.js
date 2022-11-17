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
    pl: 0.5,
    height: '54px',
  };

  const toolbarSx = {
    px: 0,
    display: 'flex',
    justifyContent: 'baseline',
    '@media (min-width: 600px)': {
      px: 0,
    },
  };

  const detailsContainerSx = {
    display: 'flex',
    alignItems: 'center',
    ml: 'auto',
    mr: 1,
  };

  const detailTextSx = {
    color: theme => theme.palette.getContrastText(color),
    ml: 0.5
  };

  const detailIconSx = {
    color: theme => theme.palette.getContrastText(color),
    fontSize: '16px',
  };

  const scopeNameSx = {
    color: theme => theme.palette.getContrastText(color),
    width: '140px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };
  
  return <AppBar variant='dense' position="static" sx={appBarSx}>
    <DoubleArrowIcon fontSize='small' sx={{transform: 'rotate(180deg)', color: theme => theme.palette.getContrastText(color), m: 0, p: 0}} onClick={onBackButtonClick}/>
    <Toolbar sx={toolbarSx}>
      <Typography variant="body2" component='h3' sx={scopeNameSx}>{name.toUpperCase()}</Typography>
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