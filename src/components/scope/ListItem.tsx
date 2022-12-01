import React, {KeyboardEvent, FC, ChangeEvent, SyntheticEvent, useState, ReactNode, memo} from 'react';

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
import Box from '@mui/material/Box';

export type listItemType = {
  id: UUID,
  name: string,
  color: HEXColor,
  isActive?: boolean
}

export type ListItemProps = {
  itemId: UUID,
  name: string,
  color: HEXColor,
  isActive?: boolean,
  isEditing: boolean,
  actionIcons?: Array<{ id: string, activeIcon: ReactNode, inactiveIcon?: ReactNode }>,
  contextualMenu?: Array<{ id: string, label: string, icon?: ReactNode }>,
  onActionClick: (itemId: UUID, actionId: string) => void,
  onClick: (itemId: UUID) => void,
  onColorChange: (color: HEXColor, itemId: UUID) => void,
  onContextualMenuClick?: (menuId: string, itemId: UUID) => void,
  onNameChange: (name: string, itemId: UUID) => void,
  onStopEditing?: () => void
}

// TODO add display name
// eslint-disable-next-line react/display-name
const ListItem: FC<ListItemProps> = memo(({
  itemId,
  name,
  color,
  isActive,
  isEditing,
  actionIcons,
  contextualMenu,
  onActionClick,
  onClick,
  onColorChange, 
  onContextualMenuClick,
  onNameChange,
  onStopEditing
}) => {
  const {t} = useTranslation();

  //STYLES
  const actionIconSx = {
    m: 0, 
    p: 0.5,
    '& .MuiSvgIcon-root': { color: isActive ? 'action.active' : 'action.disabled' }
  };
  
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
  
  //CONTEXTUAL MENU
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleContextualMenu = (e: SyntheticEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);
  const handleAction = (actionId: string) => onContextualMenuClick && onContextualMenuClick(actionId, itemId);

  //EDIT
  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => onNameChange(e.target.value, itemId);
  const handleColorChange = (color: {hex: string}) => onColorChange(`#${color.hex}`, itemId);
  const handleBlur = () => {
    setAnchorEl(null);
    onStopEditing && onStopEditing();
  };
  const handleInputOut = (e: KeyboardEvent<HTMLInputElement>) => {
    if(e.key === 'Enter') {
      setAnchorEl(null);
      onStopEditing && onStopEditing();
    }
  };
  
  return <MuiListItem sx={{height: '48px', p: 0, m: 0}}>
    <ListItemIcon sx={{minWidth: '24px', p: 0}}>
      {
        isEditing ?
          <ColorPicker
            hideTextfield
            disableAlpha
            value={color}
            inputFormats={[]}
            onChange={handleColorChange}
          />
          :
          <Box sx={{width: 24, height: 24, bgcolor: color, borderRadius: 1, mx: 0.75}}/>
      }

    </ListItemIcon>
    {
      isEditing ?
        <TextField size='small' label='' variant='outlined' sx={{mr: 1, flexGrow: 1}}
          key='listItem'
          error={name.length < 1}
          inputRef={input => input && input.focus()}
          onChange={handleNameChange} 
          onBlur={handleBlur} 
          onKeyDown={handleInputOut}
          defaultValue={name}
        />
        :
        <TextField size='small' label='' variant='outlined' sx={noEditableTextField}
          onClick={() => onClick(itemId)}
          inputProps={{ readOnly: true }}
          defaultValue={name}
        />
    }
    {
      !isEditing && actionIcons?.map(i =>
        <IconButton key={i.id} onClick={() => onActionClick(itemId, i?.id)} sx={actionIconSx}>
          {isActive ? i.activeIcon : i.inactiveIcon}
        </IconButton>)
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
});

export default ListItem;
