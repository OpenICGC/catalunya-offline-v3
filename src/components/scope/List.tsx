import React, {FC, ReactNode, useMemo, useState} from 'react';

//MUI
import Box from '@mui/material/Box';
import MuiList from '@mui/material/List';
import Typography from '@mui/material/Typography';

//MUI-ICONS
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

//GEOCOMPONETS
import SearchBox from '@geomatico/geocomponents/SearchBox';

//CATOFFLINE
import ListItem, {listItemType} from './ListItem';

//UTILS
import {HEXColor, UUID} from '../../types/commonTypes';
import {useTranslation} from 'react-i18next';
import styled from '@mui/styles/styled';

export type ListProps = {
    isAccessibleSize: boolean,
    items: Array<listItemType>, //Required: items may not exist yet => items.length === 0
    contextualMenu: Array<{ id: string, label: string, icon?: ReactNode }>,
    activeActionIcons?: Array<{ id: string, icon: ReactNode }>,
    inactiveActionIcon?: ReactNode,
    onActionClick: (itemId: UUID) => void,
    onClick: (itemId: UUID) => void,
    onColorChange: (color: HEXColor, itemId: UUID) => void,
    onContextualMenuClick: (menuId: string, itemId: UUID) => void,
    onNameChange: (name: string, itemId: UUID) => void
};

//STYLES
const errorMessageSx = {
  mt: 1, 
  mx: 2, 
  color: 'error.main', 
  display: 'block'
};



const normalize = (string: string) => string.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');

const List: FC<ListProps> = ({
  isAccessibleSize = false,
  items,
  contextualMenu,
  activeActionIcons,
  inactiveActionIcon,
  onActionClick,
  onClick,
  onColorChange,
  onContextualMenuClick,
  onNameChange}) => {

  const ScrollableContent = styled(Box)({
    overflow: 'auto',
    padding: '0px',
    marginBottom: isAccessibleSize ? '72px' : '64px',
  });
    
  const {t} = useTranslation();
  const [searchText, setSearchText] = useState('');

  const filteredItems = useMemo(() =>
    searchText ?
      items.filter(item => normalize(item.name).includes(normalize(searchText))) :
      items
  , [searchText, items]);
  
  const handleOnTextChange = (text: string) => setSearchText(text);
  const handleSearchClick = () => undefined;
  
  return <>
    <Box sx={{px: 1, pt: 1, pb: 1, bgcolor: 'common.white'}}>
      <SearchBox
        text={searchText}
        placeholder={t('actions.search')}
        AdvanceSearchIcon={KeyboardBackspaceIcon}
        onSearchClick={handleSearchClick}
        onTextChange={handleOnTextChange}
        dense
      />
    </Box>
    {
      items.length === 0 ?
        <Typography variant='caption' sx={errorMessageSx}>No existe ningún elemento.</Typography>
        : filteredItems.length === 0 ?
          <Typography variant='caption' sx={errorMessageSx}>No coincide ningún elemento con la búsqueda.</Typography>
          : undefined
    }
    <ScrollableContent>
      <MuiList dense sx={{ml: 0.75, my: 0, mr: 0}}>
        {
          filteredItems.map(item => <ListItem
            key={item.id}
            item={item}
            activeActionIcons={activeActionIcons}
            inactiveActionIcon={inactiveActionIcon}
            contextualMenu={contextualMenu}
            onActionClick={onActionClick}
            onClick={onClick}
            onColorChange={onColorChange}
            onContextualMenuClick={onContextualMenuClick}
            onNameChange={onNameChange}
          />)
        }
      </MuiList>
    </ScrollableContent>
  </>;
};

export default List;