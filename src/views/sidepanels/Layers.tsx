import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';

//MUI
import useTheme from '@mui/material/styles/useTheme';
import LayersIcon from '@mui/icons-material/Layers';

//CATOFFLINE
import Header from '../../components/common/Header';
import UserLayerPanel from '../../components/common/UserLayerPanel';

//CATOFFLINE-ICONS
/*import RuralAccommodation from '../../components/icons/RuralAccommodation';
import MountainHut from '../../components/icons/MountainHut';
import YouthHostel from '../../components/icons/YouthHostel';
import Camping from '../../components/icons/Camping';*/
import {UserLayer} from '../../types/commonTypes';

/*const itemConfig = [
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
];*/

export type LayersProps = {
  userLayers: Array<UserLayer>,
  visibleLayers: Array<string>,
  toggleLayerVisibility: (layerId: string) => void
};

const Layers: FC<LayersProps> = ({
  userLayers,
  visibleLayers,
  toggleLayerVisibility
}) => {
  const {t} = useTranslation();
  const theme = useTheme();

  const items = userLayers.map(layer => ({
    ...layer,
    isVisible: visibleLayers.includes(layer.id)
  }));

  return <>
    <Header
      startIcon={<LayersIcon/>}
      name={t('layerManager.title')}
      color={`#${theme.palette.secondary.main}`}
    />
    <UserLayerPanel
      userLayers={items}
      onAdd={()=> console.log('add')}
      onColorChange={()=> console.log('color')}
      onRename={()=> console.log('rename')}
      onToggleVisibility={toggleLayerVisibility}
      onDelete={()=> console.log('delete')}
    />
  </>;
};

export default Layers;
