import React, {FC, ReactNode, useCallback, useMemo, useState} from 'react';

//MUI
import Box from '@mui/material/Box';
import MuiList from '@mui/material/List';
import Typography from '@mui/material/Typography';

//MUI-ICONS
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

//GEOCOMPONETS
import SearchBox from '@geomatico/geocomponents/SearchBox';

//CATOFFLINE
import ListItem from './ListItem';

//UTILS
import {HEXColor, UUID} from '../../types/commonTypes';
import {useTranslation} from 'react-i18next';
import styled from '@mui/styles/styled';

const errorMessageSx = {
  mt: 1,
  mx: 2,
  color: 'error.main',
  display: 'block'
};

const searchBoxWrapperSx = {
  px: 1,
  pt: 1,
  pb: 1,
  bgcolor: 'common.white'
};

const muiListSx = {ml: 0.75, my: 0, mr: 0};

const normalizeSearchString = (string: string) => string.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');

export interface listItemType {
  id: UUID;
  name: string;
  color: HEXColor;
  isActive?: boolean;
}

export interface contextualMenuEntry {
  id: string;
  label: string;
  icon?: ReactNode;
}

export interface actionIconType {
  id: string;
  activeIcon: ReactNode;
  inactiveIcon?: ReactNode;
}

export type ListProps = {
  isAccessibleSize: boolean,
  items: Array<listItemType>, //Required: items may not exist yet => items.length === 0
  actionIcons?: Array<actionIconType>,
  contextualMenu: Array<contextualMenuEntry>,
  onClick: (itemId: UUID) => void,
  onColorChange: (itemId: UUID, color: HEXColor) => void,
  onNameChange: (itemId: UUID, name: string) => void
  onActionClick: (itemId: UUID, actionId: string) => void,
  onContextualMenuClick: (itemId: UUID, menuId: string) => void
};

const List: FC<ListProps> = ({
  isAccessibleSize = false,
  items,
  contextualMenu,
  actionIcons,
  onActionClick,
  onClick,
  onColorChange,
  onContextualMenuClick = () => undefined,
  onNameChange}) => {

  const ScrollableContent = useMemo(() => styled(Box)({
    overflow: 'auto',
    padding: '0px',
    marginBottom: isAccessibleSize ? '72px' : '64px',
  }), [isAccessibleSize]);
    
  const {t} = useTranslation();
  const [searchText, setSearchText] = useState('');
  const [getEditingId, setEditingId] = useState<UUID | undefined>();

  const filteredItems = useMemo(() =>
    searchText ?
      items.filter(item => normalizeSearchString(item.name).includes(normalizeSearchString(searchText))) :
      items
  , [searchText, items]);

  const handleContextualMenuClick = useCallback((itemId: UUID, actionId: string) => {
    actionId === 'edit' ?
      setEditingId(itemId) :
      onContextualMenuClick(itemId, actionId);
  }, [onContextualMenuClick]);

  const handleStopEditing = useCallback(() => setEditingId(undefined), []);

  const handleSearchClick = useCallback(() => undefined, []);
  
  return <>
    <Box sx={searchBoxWrapperSx}>
      <SearchBox
        text={searchText}
        placeholder={t('actions.search')}
        AdvanceSearchIcon={KeyboardBackspaceIcon}
        onSearchClick={handleSearchClick}
        onTextChange={setSearchText}
        dense
      />
    </Box>
    {
      items.length === 0 ?
        <Typography variant='caption' sx={errorMessageSx}>{t('scopeList.empty')}</Typography>
        : filteredItems.length === 0 ?
          <Typography variant='caption' sx={errorMessageSx}>{t('scopeList.notFound')}</Typography>
          : undefined
    }
    <ScrollableContent>
      <MuiList dense sx={muiListSx}>
        {
          filteredItems.map(item => <ListItem
            key={item.id}
            itemId={item.id}
            name={item.name}
            color={item.color}
            isEditing={item.id === getEditingId}
            isActive={item.isActive}
            actionIcons={actionIcons}
            contextualMenu={contextualMenu}
            onActionClick={onActionClick}
            onClick={onClick}
            onColorChange={onColorChange}
            onContextualMenuClick={handleContextualMenuClick}
            onNameChange={onNameChange}
            onStopEditing={handleStopEditing}
          />)
        }
      </MuiList>
    </ScrollableContent>
  </>;
};

export default List;
