import React, {FC} from 'react';
import SvgIcon  from '@mui/material/SvgIcon';
import {SvgIconProps} from '@mui/material/SvgIcon/SvgIcon';

// Derived from MUI's "Route" icon
const Hostel: FC<SvgIconProps> = (props) => {
  return <SvgIcon {...props}>
    <path d="M16.728 23.315v-4.776h.817l-3.313-4.319-3.384 4.319h.865v4.776h-3v-2.4l2.136.456-1.704-4.008.768.313-1.008-4.033.431.145-1.2-4.272-1.175 4.272.359-.145-.864 4.033.744-.313-1.751 4.008 2.256-.456v2.4H0L11.833.684 24 23.315h-7.272zm-3.264 0V20.17h1.824v3.145h-1.824z" />
  </SvgIcon>;
};

export default Hostel;