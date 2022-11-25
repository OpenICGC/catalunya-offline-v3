import React, {FC, ReactNode, useState} from 'react';

//MUI
import List from '@mui/material/List';

//MUI-ICONS
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

//GEOCOMPONETS
import SearchBox from '@geomatico/geocomponents/SearchBox';

//CATOFFLINE
import EntityListItem from './EntityListItem';

//UTILS
import {Entity, HEXColor, UUID} from '../../types/commonTypes';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

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

  const [searchText, setSearchText] = useState('');
  const [filteredEntities, setFilteredEntities] = useState(entities);

  const handleSearchClick = () => setFilteredEntities(
    entities?.filter(obj => JSON.stringify(obj).toString().toLowerCase().includes(searchText.toLowerCase()))
  );
  
  const handleOnTextChange = (text: string ) => setSearchText(text);
  
  return <>
    <Box sx={{mx: 1, mt: 2}}>
      <SearchBox
        text={searchText}
        placeholder={'Buscar...'}
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