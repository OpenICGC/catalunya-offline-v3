import React, {FC, ReactNode, useMemo} from 'react';
import {UUID} from '../../types/commonTypes';

//MUI
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import MuiListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';

//MUI-ICONS
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

//TYPES
export type LayerItemProps = {
  itemId: UUID,
  icon: ReactNode,
  name: string
  isActive: boolean
  onActionClick: (itemId: UUID, actionId: string) => void,
};

//STYLES
const muiListItemSx = {height: '48px', p: 0, m: 0};
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
};

const LayerItem: FC<LayerItemProps> = ({
  itemId,
  icon,
  name,
  isActive= true,
  onActionClick,
}) => {

  const actionIcons = [
    {
      id: 'visibility',
      activeIcon: <VisibilityIcon/>,
      inactiveIcon: <VisibilityOffIcon color='disabled'/>,
    }
  ];
  const actionIconSx = useMemo(() => ({
    m: 0,
    p: 0.5,
    '& ..MuiIconButton-root': { color: isActive ? 'action.active' : 'action.disabled' },
    '&.Mui-disabled': {color: 'action.disabled'}
  }), [isActive]);

  return <MuiListItem sx={muiListItemSx}>
    <ListItemIcon sx={listItemIconSx}>
      {icon}
    </ListItemIcon>
    <TextField size='small' label='' variant='outlined' sx={noEditableTextField}
      inputProps={{ readOnly: true }}
      value={name}
    />
    {
      actionIcons?.map(actionIcon =>
        <IconButton key={actionIcon.id} onClick={() => onActionClick(itemId, actionIcon?.id)} sx={actionIconSx}>
          {isActive ? actionIcon.activeIcon : actionIcon.inactiveIcon}
        </IconButton>
      )
    }
  </MuiListItem>;
};
export default LayerItem;