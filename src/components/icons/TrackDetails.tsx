import React, {FC} from 'react';
import SvgIcon  from '@mui/material/SvgIcon';
import {SvgIconProps} from '@mui/material/SvgIcon/SvgIcon';

// Derived from MUI's "Route" icon, find SVG source in resources/icons/trackDetails.svg
const TrackDetails: FC<SvgIconProps> = (props) => {
  return <SvgIcon {...props}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      xmlSpace="preserve"
      {...props}
    >
      <path d="M19 15.18V7c0-2.21-1.79-4-4-4s-4 1.79-4 4v10c0 1.1-.9 2-2 2s-2-.9-2-2V8.82C8.16 8.4 9 7.3 9 6c0-1.66-1.34-3-3-3S3 4.34 3 6c0 1.3.84 2.4 2 2.82V17c0 2.21 1.79 4 4 4s4-1.79 4-4V7c0-1.1.9-2 2-2s2 .9 2 2v8.18A2.996 2.996 0 0 0 18 21c1.66 0 3-1.34 3-3 0-1.3-.84-2.4-2-2.82z" />
      <circle fill="#FFF" cx={16.938} cy={16.859} r={5.391} />
      <path d="M20.753 19.358c.4-.7.7-1.5.7-2.4 0-2.5-2-4.5-4.5-4.5s-4.5 2-4.5 4.5 2 4.5 4.5 4.5c.9 0 1.7-.3 2.4-.7l2.699 2.7 1.4-1.4-2.699-2.7zm-3.8.1c-1.4 0-2.5-1.1-2.5-2.5s1.1-2.5 2.5-2.5 2.5 1.1 2.5 2.5-1.099 2.5-2.5 2.5z" />
    </svg>
  </SvgIcon>;
};

export default TrackDetails;