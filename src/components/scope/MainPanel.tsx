import React, {FC, useCallback, useMemo} from 'react';

//MUI
import Box from '@mui/material/Box';

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

//UTILS
import {useTranslation} from 'react-i18next';
import {HEXColor, UUID} from '../../types/commonTypes';
import {useTheme} from '@mui/material';
import {listItemType} from './ListItem';

const boxSx = {width: '100%', height: 0};

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

  const contextualMenu = useMemo(() => ([
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
  ]), [onDelete, onInstamaps, onDataSchema, t]);

  const handleContextualMenuClick = useCallback((menuId: string, itemId: UUID) => {
    const menuEntry = contextualMenu.find(({id}) => id === menuId);
    if (menuEntry?.callbackProp) {
      menuEntry.callbackProp(itemId);
    }
  }, [contextualMenu]);

  const actionIcons = useMemo(() => ([{id: 'export', activeIcon: <FileUploadIcon/>}]), []);

  return <>
    <ManagerHeader
      name={t('scopeManager')}
      color={theme.palette.secondary.main}
      startIcon={<FolderIcon/>}
    />
    <List
      isAccessibleSize={isAccessibleSize}
      items={items}
      contextualMenu={contextualMenu}
      actionIcons={actionIcons}
      onActionClick={onShare}
      onClick={onSelect}
      onColorChange={onColorChange}
      onContextualMenuClick={handleContextualMenuClick}
      onNameChange={onRename}
    />
    <Box sx={boxSx}>
      <AddButton
        isAccessibleSize={isAccessibleSize}
        isLeftHanded={isLeftHanded}
        onClick={onAdd}
      >
        <CreateNewFolderIcon/>
      </AddButton>
    </Box>
  </>;
};

export default MainPanel;
