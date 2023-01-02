import React, {FC, useMemo} from 'react';

import useTheme from '@mui/material/styles/useTheme';
import MapIcon from '@mui/icons-material/Map';

import BaseMapList from '@geomatico/geocomponents/BaseMapList';

import Header from '../../components/common/Header';
import {useTranslation} from 'react-i18next';
import {BASEMAPS} from '../../config';

export type BaseMapsProps = {
  baseMapId: string,
  onMapStyleChanged: (newStyle: string) => void
};

const BaseMaps: FC<BaseMapsProps> = ({baseMapId, onMapStyleChanged}) => {
  const {t, i18n} = useTranslation();
  const theme = useTheme();
  const basemaps = useMemo(() =>
    BASEMAPS.map((basemap) => ({
      ...basemap,
      label: basemap.labels[i18n.language.split('-')[0]]
    }))
  , []);

  return <>
    <Header
      startIcon={<MapIcon/>}
      name={t('baseMapManager')}
      color={`#${theme.palette.secondary.main}`}
    />

    <BaseMapList
      styles={basemaps}
      selectedStyleId={baseMapId}
      onStyleChange={onMapStyleChanged}
      variant="list"
    />
  </>;
};

export default BaseMaps;
