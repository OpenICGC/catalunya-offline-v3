import React, {FC, ReactNode} from 'react';

//MUI
import MuiList from '@mui/material/List';

//CATOFFLINE
import LayerItem from './LayerItem';

//UTILS
import {UUID} from '../../types/commonTypes';
import {useTranslation} from 'react-i18next';

//TYPES
export type LayerListProps = {
  items: Array<{id: UUID, icon: ReactNode, name: string, isVisible: boolean}>,
  onActionClick?: (itemId: UUID, actionId: string) => void,
};

//STYLES
const muiListSx = {
  ml: 0.75,
  my: 0,
  mr: 0
};
const LayerList: FC<LayerListProps> = ({
  items,
  onActionClick= () => undefined
}) => {
  const {t} = useTranslation();
  return <MuiList dense sx={muiListSx}>
    {
      items.map(item => <LayerItem
        key={item.id}
        icon={item.icon}
        itemId={item.id}
        name={t(item.name)}
        isVisible={item.isVisible}
        onActionClick={onActionClick}
      />)
    }
  </MuiList>;
};
export default LayerList;