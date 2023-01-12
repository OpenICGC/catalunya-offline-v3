import React, {FC} from 'react';
import SvgIcon  from '@mui/material/SvgIcon';
import {SvgIconProps} from '@mui/material/SvgIcon/SvgIcon';

// Derived from MUI's "SwipeRightAlt" icon, find SVG source in resources/icons/noGoTo.svg
const NoGoTo: FC<SvgIconProps> = (props) => {
  return <SvgIcon {...props}>
    <defs>
      <path id="a" d="M0 0h24v24H0z" />
    </defs>
    <clipPath id="b">
      <use xlinkHref="#a" overflow="visible" />
    </clipPath>
    <g clipPath="url(#b)">
      <path d="m18.17 13-1.164 1.164 1.415 1.415L22 12l-4-4-1.41 1.41L18.17 11H13.9a5.001 5.001 0 0 0-3.968-3.909L15.842 13h2.328zM13.698 13.686 7.323 7.31l-.018.008-4.511-4.511L1.38 4.221l4.182 4.183A4.93 4.93 0 0 0 4 12c0 2.76 2.24 5 5 5a4.955 4.955 0 0 0 3.602-1.557l7.163 7.164 1.414-1.414-7.488-7.489c.001-.007.005-.012.007-.018z" />
    </g>
  </SvgIcon>;
};

export default NoGoTo;