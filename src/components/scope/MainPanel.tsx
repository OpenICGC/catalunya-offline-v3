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
import List from './List';
import ManagerHeader from '../common/ManagerHeader';
import {listItemType} from './ListItem';

//UTILS
import {useTranslation} from 'react-i18next';
import {HEXColor, UUID} from '../../types/commonTypes';
import {useTheme} from '@mui/material';
import styled from '@mui/styles/styled';
import Box from '@mui/material/Box';

export type MainPanelProps = {
  isAccessibleSize?: boolean,
  isLeftHanded?: boolean,
  items: Array<listItemType>,
  onAdd: () => void,
  onSelect: (itemId: UUID) => void,
  onColorChange: (color: HEXColor, itemId: UUID) => void,
  onRename: (name: string, itemId: UUID) => void,
  onShare: (itemId: UUID) => void,
  onDelete: (itemId: UUID) => void,
  onInstamaps: (itemId: UUID) => void,
  onDataSchema: (itemId: UUID) => void
};

const MainPanel: FC<MainPanelProps> = ({
  isAccessibleSize = false,
  isLeftHanded = false,
  items,
  onAdd,
  onSelect,
  onColorChange,
  onRename,
  onShare,
  onDelete,
  onInstamaps,
  onDataSchema
}) => {
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
      icon: <DeleteIcon/>,
      callbackProp: onDelete
    },
    {
      id: 'instamaps',
      label: t('actions.instamaps'),
      icon: <MoreHorizIcon/>,
      callbackProp: onInstamaps
    },
    {
      id: 'dataSchema',
      label: t('actions.dataSchema'),
      icon: <DashboardIcon/>,
      callbackProp: onDataSchema
    }
  ];

  const handleContextualMenuClick = (menuId: string, itemId: UUID) => {
    const menuEntry = contextualMenu.find(({id}) => id === menuId);
    if (menuEntry?.callbackProp) {
      menuEntry.callbackProp(itemId);
    }
  };

  return <>
    <ManagerHeader
      name={t('scopeManager')}
      color={theme.palette.secondary.main}
      startIcon={<FolderIcon/>}
    />
    <List
      items={items}
      contextualMenu={contextualMenu}
      activeActionIcon={<FileUploadIcon/>}
      onActionClick={onShare}
      onClick={onSelect}
      onColorChange={onColorChange}
      onContextualMenuClick={handleContextualMenuClick}
      onNameChange={onRename}
    />
    <AddButton
      isAccessibleSize={isAccessibleSize}
      isLeftHanded={isLeftHanded}
      onClick={onAdd}
    >
      <CreateNewFolderIcon/>
    </AddButton>
  </>;
};

export default MainPanel;
