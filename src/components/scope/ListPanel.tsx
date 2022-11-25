import React, {FC, ReactNode} from 'react';

//MUI
import List from '@mui/material/List';

//MUI-ICONS
import FolderIcon from '@mui/icons-material/Folder';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

//CATOFFLINE
import ManagerHeader from '../ManagerHeader';
import EntityListItem from './EntityListItem';

//UTILS
import {useTranslation} from 'react-i18next';
import {HEXColor, Scope, UUID} from '../../types/commonTypes';

export type ListPanelProps = {
    scopes: Array<Scope>,
    contextualMenu: Array<{ id: string, label: string, icon?: ReactNode }>,
    onActionClick: (entityId: UUID) => void,
    onClick: (entityId: UUID) => void,
    onColorChange: (color: HEXColor, entityId: UUID) => void,
    onContextualMenuClick: (menuId: string, entityId: UUID) => void,
    onNameChange: (name: string, entityId: UUID) => void
};

const ListPanel: FC<ListPanelProps> = ({
  scopes, 
  onActionClick,
  onClick,
  onColorChange,
  onContextualMenuClick,
  onNameChange}) => {
  //STYLES
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
    <ManagerHeader name='Ámbitos' color='#1b718c' startIcon={<FolderIcon sx={{color: theme => theme.palette.getContrastText('#fc5252')}}/>}/>
    <List dense sx={{ml: 0.75, my: 0, mr: 0}}>
      {
        scopes.map(scope => <EntityListItem
          key={scope.id}
          entity={scope}
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

export default ListPanel;