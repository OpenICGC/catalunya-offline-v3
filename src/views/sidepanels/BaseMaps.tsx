import React, {FC, useMemo} from 'react';

import useTheme from '@mui/material/styles/useTheme';
import MapIcon from '@mui/icons-material/Map';
import {useTranslation} from 'react-i18next';

import BaseMapList from '@geomatico/geocomponents/BaseMapList';
import {BASEMAPS} from '../../config';
import ManagerHeader from '../../components/common/ManagerHeader';

export type BaseMapsProps = {
  baseMapId: string,
  onMapStyleChanged: (newStyle: string) => void
};

const BaseMaps: FC<BaseMapsProps> = ({baseMapId, onMapStyleChanged}) => {
  const theme = useTheme();
  const { i18n } = useTranslation();
  const basemaps = useMemo(() =>
    BASEMAPS.map((basemap) => ({
      ...basemap,
      label: basemap.labels[i18n.language.split('-')[0]]
    }))
  , []);

  return <>
    <ManagerHeader
      name="baseMapManager"
      color={theme.palette.secondary.main}
      startIcon={<MapIcon/>}
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
