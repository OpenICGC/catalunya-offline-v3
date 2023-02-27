import React, {FC} from 'react';
import SvgIcon from '@mui/material/SvgIcon';
import {SvgIconProps} from '@mui/material/SvgIcon/SvgIcon';

// Derived from MUI's "Map" icon, find SVG source in resources/icons/addBaseMap.svg
const AddBaseMap: FC<SvgIconProps> = (props) => <SvgIcon {...props}>
  <path d="M18.5 9H18V6h-3v-.9L9 3 3.36 4.9a.503.503 0 0 0-.36.48V20.5c0 .279.22.5.5.5l.16-.029L9 18.9l6 2.1 5.641-1.9a.505.505 0 0 0 .359-.48V9h-2.5zM15 19l-6-2.109V5l6 2.11V19z" />
  <path d="M21.25 2.75V0h-2.5v2.75h-3v2.5h3v3h2.5v-3H24v-2.5z" />
</SvgIcon>;

export default AddBaseMap;
