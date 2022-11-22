import React, {FC} from 'react';
import SvgIcon  from '@mui/material/SvgIcon';
import {SvgIconProps} from '@mui/material/SvgIcon/SvgIcon';

// Derived from MUI's "Explore" icon, find SVG source in resources/icons/compass.svg
const northColor = '#F00';
const southColor = '#424242';

const Compass: FC<SvgIconProps> = (props) => {
  return <SvgIcon {...props}>
    <path d="M 14.19,14.19 9.81,9.81 18,6 Z" fill={northColor}/>
    <path d="m9.81 9.81 4.38 4.38-8.19 3.81z" fill={southColor}/>
    <path d="M12 10.9c-.61 0-1.1.49-1.1 1.1s.49 1.1 1.1 1.1c.61 0 1.1-.49 1.1-1.1s-.49-1.1-1.1-1.1zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm2.19 12.19L6 18l3.81-8.19L18 6l-3.81 8.19z"/>
  </SvgIcon>;
};

export default Compass;
