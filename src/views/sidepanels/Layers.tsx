import React, {FC} from 'react';

import Header from '../../components/common/Header';

import LayersIcon from '@mui/icons-material/Layers';

import useTheme from '@mui/material/styles/useTheme';
import {useTranslation} from 'react-i18next';
import LayerList from '../../components/common/LayerList';
import RuralAccommodation from '../../components/icons/RuralAccommodation';
import MountainHut from '../../components/icons/MountainHut';
import YouthHostel from '../../components/icons/YouthHostel';
import Camping from '../../components/icons/Camping';

const itemConfig = [
  {
    id: 0,
    icon: <MountainHut sx={{color: '#D4121E'}}/>,
    name: 'layerManager.mountainHut'
  },
  {
    id: 1,
    icon: <Camping sx={{color: '#F1BE25'}}/>,
    name: 'layerManager.camping'
  },
  {
    id: 2,
    icon: <RuralAccommodation sx={{color: '#4A8A63'}}/>,
    name: 'layerManager.ruralAccommodation'
  },
  {
    id: 3,
    icon: <YouthHostel sx={{color: '#1FA1E2'}}/>,
    name: 'layerManager.youthHostel'
  }
];

export type LayersProps = {
  visibleLayers: Array<number>,
  toggleLayerVisibility: (id: number) => void
};

const Layers: FC<LayersProps> = ({visibleLayers, toggleLayerVisibility}) => {
  const {t} = useTranslation();
  const theme = useTheme();

  const items = itemConfig.map(item => ({
    ...item,
    isVisible: visibleLayers.includes(item.id)
  }));

  const actionCallbacks: Record<string, (itemId: number) => void> = {
    visibility: (itemId) => {
      toggleLayerVisibility(itemId);
    }
  };

  const handleActionClick = (itemId: number, actionId: string) => actionCallbacks[actionId](itemId);

  return <>
    <Header
      startIcon={<LayersIcon/>}
      name={t('layerManager.title')}
      color={`#${theme.palette.secondary.main}`}
    />
    <LayerList
      items={items}
      onActionClick={handleActionClick}
    />
  </>;
};

export default Layers;
