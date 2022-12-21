import React, {FC} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import RouteIcon from '@mui/icons-material/Route';
import {Theme} from '@mui/material';
import {HEXColor} from '../../types/commonTypes';

export interface FeaturesSummaryProps {
    numPoints: number,
  numTracks: number,
    colorContrastFrom: HEXColor
}

const detailsContainerSx = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  ml: 'auto'
};

const FeaturesSummary: FC<FeaturesSummaryProps> = ({
  numPoints,
  numTracks,
  colorContrastFrom
}) => {
    
  const detailTextSx = {
    color: (theme: Theme) => theme.palette.getContrastText(colorContrastFrom),
    ml: 0.5,
    fontWeight: 'bold'
  };

  const detailIconSx = {
    color: (theme: Theme) => theme.palette.getContrastText(colorContrastFrom)
  };
    
  return <Box sx={detailsContainerSx}>
    <Typography variant="caption" sx={detailTextSx}>{numPoints || 0}</Typography>
    <LocationOnIcon fontSize="small" sx={detailIconSx}/>
    <Typography variant="caption" sx={detailTextSx}>{numTracks || 0}</Typography>
    <RouteIcon fontSize="small" sx={detailIconSx}/>
  </Box>;
};

export default FeaturesSummary;