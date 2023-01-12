import React, {FC} from 'react';
import SvgIcon  from '@mui/material/SvgIcon';
import {SvgIconProps} from '@mui/material/SvgIcon/SvgIcon';

// Derived from MUI's "Place" icon, find SVG source in resources/icons/markerDetails.svg
const MarkerDetails: FC<SvgIconProps> = (props) => {
  return <SvgIcon {...props}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      xmlSpace="preserve"
      {...props}
    >
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z" />
      <circle fill="#FFF" cx={16.938} cy={16.859} r={5.391} />
      <path d="M20.753 19.358c.4-.7.7-1.5.7-2.4 0-2.5-2-4.5-4.5-4.5s-4.5 2-4.5 4.5 2 4.5 4.5 4.5c.9 0 1.7-.3 2.4-.7l2.699 2.7 1.4-1.4-2.699-2.7zm-3.8.1c-1.4 0-2.5-1.1-2.5-2.5s1.1-2.5 2.5-2.5 2.5 1.1 2.5 2.5-1.099 2.5-2.5 2.5z" />
    </svg>
  </SvgIcon>;
};

export default MarkerDetails;