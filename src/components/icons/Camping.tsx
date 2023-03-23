import React, {FC} from 'react';
import SvgIcon  from '@mui/material/SvgIcon';
import {SvgIconProps} from '@mui/material/SvgIcon/SvgIcon';

// Derived from MUI's "Route" icon
const Camping: FC<SvgIconProps> = (props) => {
  return <SvgIcon {...props}>
    <path d="M20.592 22.775h1.152V24H2.256v-1.225H3.48l7.775-18.719-1.271-3.6L11.064 0l.983 2.328L13.008 0l1.032.504-1.296 3.624 7.848 18.647zm-8.544 0h4.104l-4.104-9.911-4.247 9.911h4.247z" />
  </SvgIcon>;
};

export default Camping;