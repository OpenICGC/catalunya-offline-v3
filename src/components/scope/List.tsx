import React, {FC, ReactNode, useCallback, useMemo, useState} from 'react';

//MUI
import Box from '@mui/material/Box';
import MuiList from '@mui/material/List';
import Typography from '@mui/material/Typography';

//MUI-ICONS
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

//GEOCOMPONETS
import SearchBox from '@geomatico/geocomponents/Search/SearchBox';

//CATOFFLINE
import ListItem from './ListItem';

//UTILS
import {HEXColor, UUID} from '../../types/commonTypes';
import {useTranslation} from 'react-i18next';
import styled from '@mui/material/styles/styled';
import { SxProps } from '@mui/system/styleFunctionSx/styleFunctionSx';

const errorMessageSx = {
  mt: 1,
  mx: 2,
  color: 'error.main',
  display: 'block'
};

const normalizeSearchString = (string: string) => string.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');

export interface listItemType {
  id: UUID;
  name: string;
  color: HEXColor;
  isVisible?: boolean;
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
  isLargeSize: boolean,
  items: Array<listItemType>, //Required: items may not exist yet => items.length === 0
  actionIcons?: Array<actionIconType>,
  contextualMenu?: Array<contextualMenuEntry>,
  onClick?: (itemId: UUID) => void,
  onColorChange?: (itemId: UUID, color: HEXColor) => void,
  onNameChange?: (itemId: UUID, name: string) => void
  onActionClick?: (itemId: UUID, actionId: string) => void,
  onContextualMenuClick?: (itemId: UUID, menuId: string) => void
  searchSx?: SxProps
  listSx?: SxProps
};

const List: FC<ListProps> = ({
  isLargeSize = false,
  items,
  contextualMenu,
  actionIcons,
  onActionClick= () => undefined,
  onClick= () => undefined,
  onColorChange= () => undefined,
  onContextualMenuClick = () => undefined,
  onNameChange= () => undefined,
  searchSx={},
  listSx={}
}) => {

  const muiListSx = useMemo(() => ({
    ml: 0.75,
    my: 0,
    mr: 0,
    ...listSx
  }), [listSx]);

  const searchBoxWrapperSx = useMemo(() => ({
    px: 1,
    pt: 1,
    pb: 1,
    bgcolor: 'common.white',
    ...searchSx
  }), [searchSx]);

  const ScrollableContent = useMemo(() => styled(Box)({
    overflow: 'auto',
    padding: '0px',
    marginBottom: isLargeSize ? '72px' : '64px',
  }), [isLargeSize]);

  const {t} = useTranslation();
  const [searchText, setSearchText] = useState('');
  const [getEditingId, setEditingId] = useState<UUID | undefined>();

  const filteredItems = useMemo(() =>
    searchText ?
      items.filter(item => normalizeSearchString(item.name).includes(normalizeSearchString(searchText))) :
      items
  , [searchText, items]);

  const handleContextualMenuClick = useCallback((itemId: UUID, actionId: string) => {
    if (actionId === 'edit') {
      setEditingId(itemId);
    } else {
      onContextualMenuClick(itemId, actionId);
    }
  }, [onContextualMenuClick]);

  const handleStopEditing = useCallback(() => setEditingId(undefined), []);

  const handleSearchClick = useCallback(() => undefined, []);

  const listItems = useMemo(() =>
    filteredItems.map(item => <ListItem
      key={item.id}
      itemId={item.id}
      name={item.name}
      color={item.color}
      isEditing={item.id === getEditingId}
      isVisible={item.isVisible}
      actionIcons={actionIcons}
      contextualMenu={contextualMenu}
      onActionClick={onActionClick}
      onClick={onClick}
      onColorChange={onColorChange}
      onContextualMenuClick={handleContextualMenuClick}
      onNameChange={onNameChange}
      onStopEditing={handleStopEditing}
    />), [filteredItems, getEditingId, actionIcons, contextualMenu, onActionClick, onClick, onColorChange, handleContextualMenuClick, onNameChange, handleStopEditing]);

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
        {listItems}
      </MuiList>
    </ScrollableContent>
  </>;
};

export default List;
