import React from 'react';
import TrackProperty from './TrackProperty';

import StraightenIcon from '@mui/icons-material/Straighten';

export default {
  title: 'Scope/Inputs/TrackProperty',
  component: TrackProperty,
};

export const Default = {
  args: {
    icon: <StraightenIcon />,
    value: '16.9km',
  },
};

export const NoValue = {
  args: {
    icon: <StraightenIcon />,
  },
};
