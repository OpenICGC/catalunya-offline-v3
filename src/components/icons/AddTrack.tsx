import React, {FC} from 'react';
import SvgIcon  from '@mui/material/SvgIcon';
import {SvgIconProps} from '@mui/material/SvgIcon/SvgIcon';

// Derived from MUI's "Route" icon
const AddTrack: FC<SvgIconProps> = (props) => {
  return <SvgIcon {...props}>
    <path
      d="M16 17.18V9c0-2.21-1.79-4-4-4S8 6.79 8 9v10c0 1.1-.9 2-2 2s-2-.9-2-2v-8.18C5.16 10.4 6 9.3 6 8c0-1.66-1.34-3-3-3S0 6.34 0 8c0 1.3.84 2.4 2 2.82V19c0 2.21 1.79 4 4 4s4-1.79 4-4V9c0-1.1.9-2 2-2s2 .9 2 2v8.18A2.996 2.996 0 0 0 15 23c1.66 0 3-1.34 3-3 0-1.3-.84-2.4-2-2.82ZM20 0v3h3v2h-3v3h-2V5h-3V3h3V0h2Z"
      fill='#fff'
    />
  </SvgIcon>;
};

export default AddTrack;