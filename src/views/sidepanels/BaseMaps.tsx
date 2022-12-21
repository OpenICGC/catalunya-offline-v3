import React, {FC} from 'react';

import useTheme from '@mui/material/styles/useTheme';
import MapIcon from '@mui/icons-material/Map';

import BaseMapList from '@geomatico/geocomponents/BaseMapList';

import {MAPSTYLES} from '../../config';
import Header from '../../components/common/Header';
import {useTranslation} from 'react-i18next';

export type BaseMapsProps = {
  mapStyle: string,
  onMapStyleChanged: (newStyle: string) => void
};

const BaseMaps: FC<BaseMapsProps> = ({mapStyle, onMapStyleChanged}) => {
  const {t} = useTranslation();
  const theme = useTheme();
  return <>
    <Header
      startIcon={<MapIcon/>}
      name={t('baseMapManager')}
      color={`#${theme.palette.secondary.main}`}
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
