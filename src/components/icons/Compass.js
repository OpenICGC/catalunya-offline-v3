import React from 'react';
import SvgIcon from '@mui/material/SvgIcon';

// Source: Modified version of MUI's Explore icon
const Compass = (props) => <SvgIcon {...props}>
  <path d="M 14.19,14.19 9.81,9.81 18,6 Z" fill="#f00"/>
  <path d="M12 10.9c-.61 0-1.1.49-1.1 1.1s.49 1.1 1.1 1.1c.61 0 1.1-.49 1.1-1.1s-.49-1.1-1.1-1.1zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm2.19 12.19L6 18l3.81-8.19L18 6l-3.81 8.19z"/>
</SvgIcon>;

export default Compass;
