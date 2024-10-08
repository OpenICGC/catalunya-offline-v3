import React, {FC, useCallback, useMemo, useState} from 'react';

//MUI
import Box from '@mui/material/Box';

//MUI-ICONS
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FitBoundsIcon from '@mui/icons-material/ZoomOutMap';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

//CATOFFLINE
import AddButton from '../buttons/AddButton';
import AddLayer from '../icons/AddLayer';
import DeleteDialog, {FEATURE_DELETED} from './DeleteDialog';
import List from '../scope/List';

//UTILS
import {HEXColor, UserLayer, UUID} from '../../types/commonTypes';
import useIsLargeSize from '../../hooks/settings/useIsLargeSize';
import {useTranslation} from 'react-i18next';
import {MAX_USER_LAYER_STORAGE} from '../../config';
import StorageProgress from './StorageProgress';

export type UserLayerPanelProps = {
  userLayers: Array<UserLayer>,
  onAdd: () => void,
  onFitBounds: (layerId: UUID) => void,
  onColorChange: (layerId: UUID, newColor: HEXColor) => void,
  onRename: (layerId: UUID, newName: string) => void,
  onToggleVisibility: (layerId: UUID) => void,
  onDelete: (layerId: UUID) => void
}

//STYLES
const boxSx = {width: '100%', height: 0};

const UserLayerPanel: FC<UserLayerPanelProps> = ({
  userLayers,
  onAdd,
  onFitBounds,
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
      id: 'zoom',
      label: t('actions.fitBounds'),
      icon: <FitBoundsIcon/>,
      callbackProp: onFitBounds
    },
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

  const handleContextualMenuClick = useCallback((layerId: UUID, menuId: string) => {
    const menuEntry = contextualMenu.find(({id}) => id === menuId);
    if (menuEntry?.callbackProp) {
      menuEntry.callbackProp(layerId);
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
    if (deleteRequestId) {
      onDelete(deleteRequestId);
    }
    setDeleteRequestId(undefined);
  };

  const handleDeleteCancel = () => setDeleteRequestId(undefined);

  const progress = useMemo(() => 100 * JSON.stringify(userLayers).length / MAX_USER_LAYER_STORAGE, [userLayers]);

  return <>
    <StorageProgress progress={progress} />
    {<List
      isLargeSize={isLargeSize}
      items={userLayers}
      contextualMenu={contextualMenu}
      actionIcons={actionIcons}
      onActionClick={onToggleVisibility}
      onColorChange={onColorChange}
      onContextualMenuClick={handleContextualMenuClick}
      onNameChange={onRename}
    />}
    {
      deleteRequestId !== undefined && <DeleteDialog featureDeleted={FEATURE_DELETED.LAYER} onAccept={handleDeleteAccept} onCancel={handleDeleteCancel}/>
    }
    <Box sx={boxSx}>
      <AddButton onClick={onAdd}>
        <AddLayer/>
      </AddButton>
    </Box>
  </>;
};

export default UserLayerPanel;
