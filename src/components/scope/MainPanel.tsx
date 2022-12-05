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
import {HEXColor, UUID, Scope} from '../../types/commonTypes';
import {useTheme} from '@mui/material';

const boxSx = {width: '100%', height: 0};

export type MainPanelProps = {
  isAccessibleSize?: boolean,
  isLeftHanded?: boolean,
  scopes: Array<Scope>,
  onAdd: () => void,
  onSelect: (scopeId: UUID) => void,
  onColorChange: (scopeId: UUID, color: HEXColor) => void,
  onRename: (scopeId: UUID, name: string) => void,
  onShare: (scopeId: UUID) => void,
  onDelete: (scopeId: UUID) => void,
  onInstamaps: (scopeId: UUID) => void,
  onDataSchema: (scopeId: UUID) => void
};

const MainPanel: FC<MainPanelProps> = ({
  isAccessibleSize = false,
  isLeftHanded = false,
  scopes,
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
      id: 'edit',
      label: t('actions.edit'),
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

  const handleContextualMenuClick = useCallback((scopeId: UUID, menuId: string) => {
    const menuEntry = contextualMenu.find(({id}) => id === menuId);
    if (menuEntry?.callbackProp) {
      menuEntry.callbackProp(scopeId);
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
      items={scopes}
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
