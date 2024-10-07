import React from 'react';
import LayerItem from './LayerItem';
import HouseIcon from '@mui/icons-material/House';

export default {
  title: 'Common/LayerItem',
  component: LayerItem,
};

export const Default = {
  args: {
    itemId: 666,
    icon: <HouseIcon />,
    name: 'Refugios',
    isVisible: true,
  },
};
