import React, {FC, ReactNode, useMemo, useState} from 'react';

//MUI
import List from '@mui/material/List';

//MUI-ICONS
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

//GEOCOMPONETS
import SearchBox from '@geomatico/geocomponents/SearchBox';

//CATOFFLINE
import EntityListItem, {Entity} from './EntityListItem';

//UTILS
import {HEXColor, UUID} from '../../types/commonTypes';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {useTranslation} from 'react-i18next';

export type EntityListProps = {
    entities: Array<Entity>, //Required: entities may not exist yet => entities.length === 0
    contextualMenu: Array<{ id: string, label: string, icon?: ReactNode }>,
    activeActionIcon?: ReactNode,
    inactiveActionIcon?: ReactNode,
    onActionClick: (entityId: UUID) => void,
    onClick: (entityId: UUID) => void,
    onColorChange: (color: HEXColor, entityId: UUID) => void,
    onContextualMenuClick: (menuId: string, entityId: UUID) => void,
    onNameChange: (name: string, entityId: UUID) => void
};

//STYLES
const errorMessageSx = {
  mt: 1, 
  mx: 2, 
  color: 'error.main', 
  display: 'block'
};

const normalize = (string: string) => string.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');

const EntityList: FC<EntityListProps> = ({
  entities,
  contextualMenu,
  activeActionIcon,
  inactiveActionIcon,
  onActionClick,
  onClick,
  onColorChange,
  onContextualMenuClick,
  onNameChange}) => {

  const {t} = useTranslation();
  const [searchText, setSearchText] = useState('');

  const filteredEntities = useMemo(() =>
    searchText ?
      entities.filter(entity => normalize(entity.name).includes(normalize(searchText))) :
      entities
  , [searchText]);
  
  const handleOnTextChange = (text: string) => setSearchText(text);
  const handleSearchClick = () => undefined;
  
  return <>
    <Box sx={{mx: 1, mt: 2}}>
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
      entities.length === 0 ?
        <Typography variant='caption' sx={errorMessageSx}>No existe ningún elemento.</Typography>
        : filteredEntities.length === 0 ?
          <Typography variant='caption' sx={errorMessageSx}>No coincide ningún elemento con la búsqueda.</Typography>
          : undefined
    }
    <List dense sx={{ml: 0.75, my: 0, mr: 0}}>
      {
        filteredEntities.map(entity => <EntityListItem
          key={entity.id}
          entity={entity}
          activeActionIcon={activeActionIcon}
          inactiveActionIcon={inactiveActionIcon}
          contextualMenu={contextualMenu}
          onActionClick={onActionClick}
          onClick={onClick}
          onColorChange={onColorChange}
          onContextualMenuClick={onContextualMenuClick}
          onNameChange={onNameChange}
        />)
      }
    </List>
  </>;
};

export default EntityList;