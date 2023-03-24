import React, {FC} from 'react';

import Header from '../../components/common/Header';

import LayersIcon from '@mui/icons-material/Layers';

import useTheme from '@mui/material/styles/useTheme';
import {useTranslation} from 'react-i18next';

export type LayersProps = {
  // TODO
};

const Layers: FC<LayersProps> = () => {
  const {t} = useTranslation();
  const theme = useTheme();
  return <>
    <Header
      startIcon={<LayersIcon/>}
      name={t('layerManager.title')}
      color={`#${theme.palette.secondary.main}`}
    />
    <div>TODO: Layer Manager</div>
  </>;
};

export default Layers;
