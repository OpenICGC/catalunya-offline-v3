import React, {FC, ReactNode, useState} from 'react';

//MUI
import List from '@mui/material/List';

//MUI-ICONS
import DashboardIcon from '@mui/icons-material/Dashboard';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

//GEOCOMPONETS
import SearchBox from '@geomatico/geocomponents/SearchBox';

//CATOFFLINE
import EntityListItem from './EntityListItem';

//UTILS
import {useTranslation} from 'react-i18next';
import {HEXColor, Scope, UUID} from '../../types/commonTypes';
import Box from '@mui/material/Box';

export type ListPanelProps = {
    scopes: Array<Scope>,
    contextualMenu: Array<{ id: string, label: string, icon?: ReactNode }>,
    onActionClick: (entityId: UUID) => void,
    onClick: (entityId: UUID) => void,
    onColorChange: (color: HEXColor, entityId: UUID) => void,
    onContextualMenuClick: (menuId: string, entityId: UUID) => void,
    onNameChange: (name: string, entityId: UUID) => void
};

const EntityList: FC<ListPanelProps> = ({
  scopes, 
  onActionClick,
  onClick,
  onColorChange,
  onContextualMenuClick,
  onNameChange}) => {
    
  const [searchText, setSearchText] = useState('');
  const [filteredEntities, setFilteredEntities] = useState(scopes);
  const handleSearchClick = () => setFilteredEntities(scopes
    .filter(obj => JSON.stringify(obj).toString().toLowerCase().includes(searchText.toLowerCase())));

  const handleOnTextChange = (text: string ) => setSearchText(text);
  
  const {t} = useTranslation();
  const contextualMenu = [
    {
      id: 'rename',
      label: t('actions.rename'),
      icon: <EditIcon/>
    },
    {
      id: 'delete',
      label: t('actions.delete'),
      icon: <DeleteIcon/>
    },
    {
      id: 'instamaps',
      label: t('actions.instamaps'),
      icon: <MoreHorizIcon/>
    },
    {
      id: 'dataSchema',
      label: t('actions.dataSchema'),
      icon: <DashboardIcon/>
    }
  ];
  
  return <>
    <Box sx={{mx: 1, mt: 1}}>
      <SearchBox
        text={searchText}
        placeholder={'Buscar...'}
        AdvanceSearchIcon={KeyboardBackspaceIcon}
        onSearchClick={handleSearchClick}
        onTextChange={handleOnTextChange}
        dense
      />
    </Box>

    <List dense sx={{ml: 0.75, my: 0, mr: 0}}>
      {
        filteredEntities.map(entity => <EntityListItem
          key={entity.id}
          entity={entity}
          actionIcon={<FileUploadIcon/>}
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