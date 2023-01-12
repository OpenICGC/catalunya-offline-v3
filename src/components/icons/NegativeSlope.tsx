import React, {FC} from 'react';
import SvgIcon  from '@mui/material/SvgIcon';
import {SvgIconProps} from '@mui/material/SvgIcon/SvgIcon';

// Derived from MUI's "Landscape" icon, find SVG source in resources/icons/negativeSlope.svg
const NegativeSlope: FC<SvgIconProps> = (props) => {
  return <SvgIcon {...props}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      xmlSpace="preserve"
      {...props}
    >
      <path d="M13.2 7.07 10.25 11l2.25 3c.33.439.24 1.07-.2 1.4s-1.07.25-1.4-.2c-1.05-1.4-2.31-3.07-3.1-4.14-.4-.53-1.2-.53-1.6 0l-4 5.331C1.71 17.061 2.18 18 3 18h18c.82 0 1.29-.939.801-1.6l-7-9.331a.994.994 0 0 0-1.601.001zM17.5 5.708c-.279 0-.5.22-.5.5s.221.5.5.5h4c.28 0 .5-.22.5-.5s-.22-.5-.5-.5h-4z" />
    </svg>
  </SvgIcon>;
};

export default NegativeSlope;