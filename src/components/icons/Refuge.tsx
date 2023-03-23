import React, {FC} from 'react';
import SvgIcon  from '@mui/material/SvgIcon';
import {SvgIconProps} from '@mui/material/SvgIcon/SvgIcon';

// Derived from MUI's "Route" icon
const Refuge: FC<SvgIconProps> = (props) => {
  return <SvgIcon {...props}>
    <path d="m12.118.785 11.879 9.438-2.18 2.706-.886-.694v10.874H3.185V12.234l-.743.694-2.324-2.706 12-9.437zm5.318 18.708v-7.259H6.802v7.259h10.634zM12.118 9.408h5.317l-5.317-4.12-5.316 4.12h5.316z" />
  </SvgIcon>;
};

export default Refuge;