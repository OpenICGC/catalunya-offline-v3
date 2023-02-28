import React, {FC, ReactNode} from 'react';

//MUI
import Fab from '@mui/material/Fab';

//UTILS
import {Theme} from '@mui/material';
import {SxProps} from '@mui/system/styleFunctionSx/styleFunctionSx';

export type AddButtonProps = {
  children: ReactNode,
    isAccessibleSize: boolean,
    isLeftHanded: boolean,
    onClick: () => void,
    sx?: SxProps<Theme>
}

const AddButton: FC<AddButtonProps> = ({
  children,
  isAccessibleSize, 
  isLeftHanded ,
  onClick,
  sx
}) => {

  //STYLES
  const fabSize = isAccessibleSize ? 64 : 48;
  const iconSize = fabSize / 2;
  const fabColor = '#424242'; //grey.800 getContrast does not support 'grey.800' as a parameter

  const handleClick = () => onClick();

  const fabSx: SxProps<Theme> = {
    width: fabSize,
    height: fabSize,
    bgcolor: fabColor,
    m: 1,
    bottom: isAccessibleSize ? '80px' : '64px',
    float: isLeftHanded ? 'left' : 'right',
    '&:hover': {
      bgcolor: fabColor,
    },
    '& .MuiSvgIcon-root':{
      fontSize: iconSize,
      color: (theme: Theme) => theme.palette.getContrastText(fabColor)
    },
    ...sx
  };

  return <Fab sx={fabSx} onClick={handleClick}>
    {children}
  </Fab>;
};

export default AddButton;