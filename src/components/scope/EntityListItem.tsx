import React, {KeyboardEvent, FC, ChangeEvent, SyntheticEvent, useState, ReactNode} from 'react';

//MUI
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';

//MUI-ICONS
import MoreVertIcon from '@mui/icons-material/MoreVert';

//UTILS
import {useTranslation} from 'react-i18next';
import {ColorPicker} from 'material-ui-color';
import {RGBColor, UUID} from '../../types/commonTypes';

export type EntityListItemProps = {
  actionIcon?: ReactNode,
  color: string,
  contextualMenu: Array<{ id: string, label: string, icon?: ReactNode }>,
  id: string,
  name: string,
  onActionClick: (entityId: UUID) => void,
  onClick: (entityId: UUID) => void,
  onColorChange: (color: RGBColor, entityId: UUID) => void,
  onContextualMenuClick: (menuId: string, entityId: UUID) => void,
  onNameChange: (name: string, entityId: UUID) => void
}

const EntityListItem: FC<EntityListItemProps> = ({
  actionIcon, 
  color, 
  contextualMenu,
  id,
  name, 
  onActionClick, 
  onClick, 
  onColorChange, 
  onContextualMenuClick,
  onNameChange
}) => {
  const {t} = useTranslation();

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
    onContextualMenuClick(actionId, id);

  //EDIT
  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => onNameChange(e.target.value, id);
  const handleColorChange = (color: {hex: string}) => onColorChange(`#${color.hex}`, id);
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
  
  return <ListItem sx={{height: '48px'}}>
    <ListItemIcon sx={{minWidth: '24px'}}>
      <ColorPicker
        hideTextfield={true}
        disableAlpha={true}
        value={color}
        inputFormats={[]}
        onChange={handleColorChange}
      />
    </ListItemIcon>
    {
      isEditing ?
        <TextField size='small' label={t('scopeListItem.name')} variant='outlined' sx={{mr: 1, flexGrow: 1}}
          inputRef={input => input && input.focus()}
          onChange={handleNameChange} 
          onBlur={handleBlur} 
          onKeyDown={handleInputOut}
          defaultValue={name}
        />
        : <ListItemText primary={name} sx={{mt: 1, ml: isEditing ? 1 : 'auto', cursor: 'pointer'}} onClick={() => onClick(id)}/>
    }
    {
      !isEditing && <>
        <IconButton sx={{m: 0, p: 0.5}} onClick={() => onActionClick(id)}>
          {actionIcon}
        </IconButton>
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
              contextualMenu.map(({id, label, icon}) => <MenuItem key={id} onClick={() => handleAction(id)}>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText>{t(label)}</ListItemText>
              </MenuItem>
              )
            }
          </MenuList>
        </Menu>
      </>
    }
  </ListItem>;
};

export default EntityListItem;

