import React, {FC} from 'react';

//MUI-ICONS
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FolderIcon from '@mui/icons-material/Folder';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

//CATOFFLINE
import AddButton from '../buttons/AddButton';
import EntityList from '../common/EntityList';
import ManagerHeader from '../common/ManagerHeader';

//UTILS
import {useTranslation} from 'react-i18next';
import {Entity, HEXColor, UUID} from '../../types/commonTypes';
import {useTheme} from '@mui/material';

export type ListPanelProps = {
    entities: Array<Entity>,
    isAccessibleSize: boolean,
    isLeftHanded: boolean,
    onActionClick: (entityId: UUID) => void,
    onAddClick: () => void,
    onClick: (entityId: UUID) => void,
    onColorChange: (color: HEXColor, entityId: UUID) => void,
    onContextualMenuClick: (menuId: string, entityId: UUID) => void,
    onNameChange: (name: string, entityId: UUID) => void
};

const ListPanel: FC<ListPanelProps> = ({
  entities,
  isAccessibleSize,
  isLeftHanded,
  onActionClick,
  onAddClick,
  onClick,
  onColorChange,
  onContextualMenuClick,
  onNameChange}) => {
  
  const {t} = useTranslation();
  const theme = useTheme();
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
    <ManagerHeader 
      name={t('scopeManager')} 
      color={theme.palette.secondary.main}
      startIcon={<FolderIcon sx={{color: theme => theme.palette.getContrastText('#fc5252')}}/>}
    />
    <EntityList 
      entities={entities}
      contextualMenu={contextualMenu}
      activeActionIcon={<FileUploadIcon/>}
      onActionClick={onActionClick}
      onClick={onClick}
      onColorChange={onColorChange}
      onContextualMenuClick={onContextualMenuClick}
      onNameChange={onNameChange}
    />
    <AddButton 
      isAccessibleSize={isAccessibleSize} 
      isLeftHanded={isLeftHanded} 
      onClick={onAddClick}
    >
      <CreateNewFolderIcon/>
    </AddButton>
  </>;
};

export default ListPanel;