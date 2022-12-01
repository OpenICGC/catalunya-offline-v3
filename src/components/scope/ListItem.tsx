import React, {KeyboardEvent, FC, ChangeEvent, SyntheticEvent, useState, ReactNode} from 'react';

//MUI
import IconButton from '@mui/material/IconButton';
import MuiListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import TextField from '@mui/material/TextField';

//MUI-ICONS
import MoreVertIcon from '@mui/icons-material/MoreVert';

//UTILS
import {useTranslation} from 'react-i18next';
import {ColorPicker} from 'material-ui-color';
import {HEXColor, UUID} from '../../types/commonTypes';
import EditIcon from '@mui/icons-material/Edit';
import SwipeRightAltIcon from '@mui/icons-material/SwipeRightAlt';
import Box from '@mui/material/Box';

export type listItemType = {
  id: UUID,
  name: string,
  color: HEXColor,
  isActive?: boolean
}

export type ListItemProps = {
  item: listItemType,
  activeActionIcons?: Array<{ id: string, icon: ReactNode }>,
  inactiveActionIcon?: ReactNode,
  contextualMenu?: Array<{ id: string, label: string, icon?: ReactNode }>,
  onActionClick: (itemId: UUID, actionId: string) => void,
  onClick: (itemId: UUID) => void,
  onColorChange: (color: HEXColor, itemId: UUID) => void,
  onContextualMenuClick?: (menuId: string, itemId: UUID) => void,
  onNameChange: (name: string, itemId: UUID) => void
}

const ListItem: FC<ListItemProps> = ({
  item,
  activeActionIcons,
  inactiveActionIcon,
  contextualMenu,
  onActionClick,
  onClick, 
  onColorChange, 
  onContextualMenuClick,
  onNameChange
}) => {
  const {t} = useTranslation();

  //STYLES
  const actionIconSx = {
    m: 0, 
    p: 0.5,
    '& .MuiSvgIcon-root': { color: item.isActive ? undefined : 'action.disabled' }
  };
  
  //CONTEXTUAL MENU
  const [isEditing, setIsEditing] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleContextualMenu = (e: SyntheticEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);
  const handleAction = (actionId: string) => actionId === 'rename' ?
    setIsEditing(true) :
    onContextualMenuClick && onContextualMenuClick(actionId, item.id);

  //EDIT
  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => onNameChange(e.target.value, item.id);
  const handleColorChange = (color: {hex: string}) => onColorChange(`#${color.hex}`, item.id);
  const handleBlur = () => {
    setAnchorEl(null);
    setIsEditing(false);
  };
  const handleInputOut = (e: KeyboardEvent<HTMLInputElement>) => {
    if(e.key === 'Enter') {
      setAnchorEl(null);
      setIsEditing(false);
    }
  };
  
  return <MuiListItem sx={{height: '48px', p: 0, m: 0}}>
    <ListItemIcon sx={{minWidth: '24px', p: 0}}>
      <ColorPicker
        hideTextfield
        disableAlpha
        value={item.color}
        inputFormats={[]}
        onChange={handleColorChange}
      />
    </ListItemIcon>
    {
      isEditing ?
        <TextField size='small' label={t('properties.name')} variant='outlined' sx={{mr: 1, flexGrow: 1}}
          inputRef={input => input && input.focus()}
          onChange={handleNameChange} 
          onBlur={handleBlur} 
          onKeyDown={handleInputOut}
          defaultValue={item.name}
        />
        : <ListItemText primary={item.name} sx={{mt: 1, ml: isEditing ? 1 : 'auto', cursor: 'pointer'}} onClick={() => onClick(item.id)}/>
    }
    {
      !isEditing && activeActionIcons?.map(i =>
        <Box key={i.id}>
          <IconButton onClick={() => onActionClick(item.id, i?.id)} sx={actionIconSx}>
            {item.isActive ? i.icon : inactiveActionIcon}
          </IconButton>
        </Box>)
    }
    {
      !isEditing && contextualMenu && <>
        <IconButton sx={{m: 0, p: 0.5}} onClick={handleContextualMenu}>
          <MoreVertIcon/>
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          sx={{zIndex: 2500}}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
        >
          <MenuList dense sx={{p: 0}}>
            {
              contextualMenu?.map(({id, label, icon}) => <MenuItem key={id} onClick={() => handleAction(id)}>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText>{t(label)}</ListItemText>
              </MenuItem>
              )
            }
          </MenuList>
        </Menu>
      </>
    }
  </MuiListItem>;
};

export default ListItem;
