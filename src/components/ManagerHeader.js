import React from 'react';
import PropTypes from 'prop-types';

//MUI
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

const ManagerHeader = ({name, color, startIcon}) => {
  
  //STYLES
  const appBarSx = {
    display: 'flex',
    flexFlow: 'row noWrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
    bgcolor: color || 'secondary.main',
    pl: 2
  };
  
  return <AppBar varinat='dense' position="static" sx={appBarSx}>
    {startIcon}
    <Toolbar>
      <Typography variant="h5" sx={{color: theme => theme.palette.getContrastText(color), mt: 0.5}}>{name}</Typography>
    </Toolbar>
  </AppBar>;
};

ManagerHeader.propTypes = {
  name: PropTypes.string.isRequired,
  color: PropTypes.string,
  startIcon: PropTypes.element,
};

export default ManagerHeader;