import React, {FC, useCallback, useMemo, useState} from 'react';

//MUI
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import MuiListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';

//MUI-ICONS
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

//UTILS
import {HEXColor, UserLayer, UUID} from '../../types/commonTypes';
import List from '../scope/List';
import DeleteDialog, {FEATURE_DELETED} from './DeleteDialog';
import Box from '@mui/material/Box';
import AddButton from '../buttons/AddButton';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import useIsLargeSize from '../../hooks/settings/useIsLargeSize';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import {useTranslation} from 'react-i18next';

export type UserLayerPanelProps = {
  userLayers: Array<UserLayer>,
  onAdd: () => void,
  onColorChange: (layerId: UUID, color: HEXColor) => void,
  onRename: (layerId: UUID, newName: string) => void,
  onToggleVisibility: (layerId: UUID) => void,
  onDelete: (layerId: UUID) => void
}

//STYLES
const boxSx = {width: '100%', height: 0};


/*const muiListItemSx = {height: '48px', p: 0, m: 0};
const listItemIconSx = {minWidth: '24px', p: 0};
const noEditableTextField = {
  mr: 1,
  flexGrow: 1,
  '& fieldset.MuiOutlinedInput-notchedOutline': {
    borderColor: 'transparent',
  },
  '&:hover fieldset.MuiOutlinedInput-notchedOutline': {
    borderColor: 'transparent',
  },
  '& fieldset.MuiOutlinedInput-notchedOutline:hover': {
    borderColor: 'transparent',
  }
};*/

const UserLayerPanel: FC<UserLayerPanelProps> = ({
  userLayers,
  onAdd,
  onColorChange,
  onRename,
  onToggleVisibility,
  onDelete 
}) => {
  const {t} = useTranslation();
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
    }
  ]), [onDelete, t, setDeleteRequestId]);
  
  const handleContextualMenuClick = useCallback((scopeId: UUID, menuId: string) => {
    const menuEntry = contextualMenu.find(({id}) => id === menuId);
    if (menuEntry?.callbackProp) {
      menuEntry.callbackProp(scopeId);
    }
  }, [contextualMenu]);


  const actionIcons = [
    {
      id: 'visibility',
      activeIcon: <VisibilityIcon/>,
      inactiveIcon: <VisibilityOffIcon color='disabled'/>,
    }
  ];

  const handleDeleteAccept = () => {
    deleteRequestId && onDelete(deleteRequestId);
    setDeleteRequestId(undefined);
  };

  const handleDeleteCancel = () => setDeleteRequestId(undefined);

  return <><List
    isLargeSize={isLargeSize}
    items={userLayers}
    contextualMenu={contextualMenu}
    actionIcons={actionIcons}
    onActionClick={onToggleVisibility}
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
export default UserLayerPanel;