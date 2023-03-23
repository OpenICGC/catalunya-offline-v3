import React, {FC, ReactNode, useMemo} from 'react';

//MUI
import Box from '@mui/material/Box';
import MuiList from '@mui/material/List';

//CATOFFLINE
import LayerItem from './LayerItem';

//UTILS
import {UUID} from '../../types/commonTypes';
import styled from '@mui/styles/styled';

//TYPES
export type LayerListProps = {
    isLargeSize: boolean,
  items: Array<{id: UUID, icon: ReactNode, name: string, isActive: boolean}>,
  onActionClick?: (itemId: UUID, actionId: string) => void,
};

//STYLES
const muiListSx = {
  ml: 0.75,
  my: 0,
  mr: 0
};
const LayerList: FC<LayerListProps> = ({
  isLargeSize= false,
  items,
  onActionClick= () => undefined
}) => {
  
  const ScrollableContent = useMemo(() => styled(Box)({
    overflow: 'auto',
    padding: '0px',
    marginBottom: isLargeSize ? '72px' : '64px',
  }), [isLargeSize]);
  
  return <ScrollableContent>
    <MuiList dense sx={muiListSx}>
      {
        items.map(item => <LayerItem
          key={item.id}
          icon={item.icon}
          itemId={item.id}
          name={item.name}
          isActive={item.isActive}
          onActionClick={onActionClick}
        />)
      }
    </MuiList>
  </ScrollableContent>;
};
export default LayerList;