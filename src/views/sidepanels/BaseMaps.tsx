import React, {FC} from 'react';

import useTheme from '@mui/material/styles/useTheme';
import MapIcon from '@mui/icons-material/Map';

import BaseMapList from '@geomatico/geocomponents/BaseMapList';

import {MAPSTYLES} from '../../config';
import ManagerHeader from '../../components/common/ManagerHeader';

export type BaseMapsProps = {
  mapStyle: string,
  onMapStyleChanged: (newStyle: string) => void
};

const BaseMaps: FC<BaseMapsProps> = ({mapStyle, onMapStyleChanged}) => {
  const theme = useTheme();
  return <>
    <ManagerHeader
      name="baseMapManager"
      color={theme.palette.secondary.main}
      startIcon={<MapIcon/>}
    />
    <BaseMapList
      styles={MAPSTYLES}
      selectedStyleId={mapStyle}
      onStyleChange={onMapStyleChanged}
      variant="list"
    />
  </>;
};

export default BaseMaps;
