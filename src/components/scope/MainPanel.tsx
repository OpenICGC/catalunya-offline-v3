import React, {FC, useCallback, useMemo, useState} from 'react';

//MUI
import Box from '@mui/material/Box';

//MUI-ICONS
import AddIcon from '@mui/icons-material/Add';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import SchemaIcon from '@mui/icons-material/AccountTree';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ShareIcon from '@mui/icons-material/Share';
import FolderIcon from '@mui/icons-material/Folder';
/*import MoreHorizIcon from '@mui/icons-material/MoreHoriz';*/
//CATOFFLINE
import AddButton from '../buttons/AddButton';
import List from './List';

//UTILS
import {useTranslation} from 'react-i18next';
import {HEXColor, Scope, UUID} from '../../types/commonTypes';
import useTheme from '@mui/material/styles/useTheme';
import Header from '../common/Header';
import useIsLargeSize from '../../hooks/settings/useIsLargeSize';
import DeleteDialog, {FEATURE_DELETED} from '../common/DeleteDialog';

const boxSx = {width: '100%', height: 0};

export type MainPanelProps = {
  scopes: Array<Scope>,
  onAdd: () => void,
  onSelect: (scopeId: UUID) => void,
  onColorChange: (scopeId: UUID, color: HEXColor) => void,
  onRename: (scopeId: UUID, name: string) => void,
  onShare: (scopeId: UUID) => void,
  onDelete: (scopeId: UUID) => void,
  /*onInstamaps: (scopeId: UUID) => void,*/
  onDataSchema: (scopeId: UUID) => void,
  onImport: (scopeId: UUID) => void
};

const MainPanel: FC<MainPanelProps> = ({
  scopes,
  onAdd,
  onSelect,
  onColorChange,
  onRename,
  onShare,
  onDelete,
  /*onInstamaps,*/
  onDataSchema,
  onImport
}) => {
  const {t} = useTranslation();
  const theme = useTheme();
  const [isLargeSize] = useIsLargeSize();
  const [deleteRequestId, setDeleteRequestId] = useState <UUID> ();

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
      callbackProp: setDeleteRequestId
    },
    /*{
      id: 'instamaps',
      label: t('actions.instamaps'),
      icon: <MoreHorizIcon/>,
      callbackProp: onInstamaps
    },*/
    {
      id: 'dataSchema',
      label: t('actions.dataSchema'),
      icon: <SchemaIcon/>,
      callbackProp: onDataSchema
    },
    {
      id: 'import',
      label: t('actions.import'),
      icon: <AddIcon/>,
      callbackProp: onImport
    }
  ]), [onDelete, /*onInstamaps, onDataSchema,*/ t, setDeleteRequestId]);

  const handleContextualMenuClick = useCallback((scopeId: UUID, menuId: string) => {
    const menuEntry = contextualMenu.find(({id}) => id === menuId);
    if (menuEntry?.callbackProp) {
      menuEntry.callbackProp(scopeId);
    }
  }, [contextualMenu]);

  const actionIcons = useMemo(() => ([{id: 'export', activeIcon: <ShareIcon/>}]), []);

  const handleDeleteAccept = () => {
    if (deleteRequestId) {
      onDelete(deleteRequestId);
    }
    setDeleteRequestId(undefined);
  };

  const handleDeleteCancel = () => setDeleteRequestId(undefined);

  return <>
    <Header
      startIcon={<FolderIcon/>}
      name={t('scopeManager')}
      color={`#${theme.palette.secondary.main}`}
    />
    <List
      isLargeSize={isLargeSize}
      items={scopes}
      contextualMenu={contextualMenu}
      actionIcons={actionIcons}
      onActionClick={onShare}
      onClick={onSelect}
      onColorChange={onColorChange}
      onContextualMenuClick={handleContextualMenuClick}
      onNameChange={onRename}
    />
    {
      deleteRequestId !== undefined && <DeleteDialog featureDeleted={FEATURE_DELETED.SCOPE} onAccept={handleDeleteAccept} onCancel={handleDeleteCancel}/>
    }
    <Box sx={boxSx}>
      <AddButton onClick={onAdd}>
        <CreateNewFolderIcon/>
      </AddButton>
    </Box>
  </>;
};

export default MainPanel;
