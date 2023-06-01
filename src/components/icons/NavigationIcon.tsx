import React, {FC} from 'react';
import SvgIcon from '@mui/material/SvgIcon';
import {SvgIconProps} from '@mui/material/SvgIcon/SvgIcon';

const NavigationIcon: FC<SvgIconProps> = (props) => <SvgIcon {...props}>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M119.178 72.985 0 423.015h60.237l86.43-350.03zM376.822 72.985h-27.489l86.43 350.03H496zM170.176 72.985 83.93 423.015h127.624l3.514-51.512h65.864l3.514 51.512H412.07l-86.243-350.03Zm66.475 4.013h22.699l3.596 49.085h-29.893zm-7.193 98.169h37.086l3.597 49.084h-44.283zm-10.791 147.25 3.596-49.082h51.475l3.599 49.082z" transform="matrix(.04857 0 0 .04857 0 -.045)"/>
  </svg>
</SvgIcon>;

export default NavigationIcon;