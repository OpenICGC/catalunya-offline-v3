import React, {FC} from 'react';
import SvgIcon from '@mui/material/SvgIcon';
import {SvgIconProps} from '@mui/material/SvgIcon/SvgIcon';

// Derived from MUI's "Layers" icon, find SVG source in resources/icons/addLayers.svg
const AddLayer: FC<SvgIconProps> = (props) => <SvgIcon {...props}>
  <path d="m11.99 20.54-7.37-5.73L3 16.07l9 7 9-7-1.63-1.27-7.38 5.74ZM12 18l7.36-5.73L21 11l-9-7-9 7 1.63 1.27L12 18ZM21 3V0h-2v3h-3v2h3v3h2V5h3V3h-3Z"
  />
</SvgIcon>;

export default AddLayer;
