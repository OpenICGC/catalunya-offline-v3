import React, {FC} from 'react';

//MUI
import Box from '@mui/material/Box';

//UTILS
import {lighten} from '@mui/system/colorManipulator';
import useTheme from '@mui/material/styles/useTheme';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import RouteIcon from '@mui/icons-material/Route';

//STYLES
const featureToApplyButtonSx = {
  width: 24,
  height: 24,
  borderRadius: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
};

const noSelectedButtonSx = {
  ...featureToApplyButtonSx,
  bgcolor: 'grey.100',
  '& .MuiSvgIcon-root': {
    color: 'grey.300',
  }
};

export enum FEATURE_APPLIED {
  POINT,
  TRACK,
}

export type FeatureToApplyButtonProps = {
  feature: FEATURE_APPLIED,
  isSelected: boolean,
  onClick: (isSelected: boolean) => void,
};

const FeatureToApplyButton: FC<FeatureToApplyButtonProps> = ({
  isSelected,
  feature,
  onClick
}) => {
  const theme = useTheme();
   
  const selectedButtonSx = {
    ...featureToApplyButtonSx,
    bgcolor: lighten(theme.palette.primary.main, 0.65),
    '& .MuiSvgIcon-root': {
      color: 'primary.main'
    }
  };

  const handleClick = () => onClick(isSelected);

  return <Box sx={isSelected ? selectedButtonSx: noSelectedButtonSx} onClick={handleClick}>
    {
      feature === FEATURE_APPLIED.POINT ? <LocationOnIcon fontSize="small"/> : <RouteIcon fontSize="small"/>
    }
  </Box>;
};


export default FeatureToApplyButton;