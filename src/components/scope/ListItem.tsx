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
import Box from '@mui/material/Box';

export type listItemType = {
  id: UUID,
  name: string,
  color: HEXColor,
  isActive?: boolean
}

export type ListItemProps = {
  item: listItemType,
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

const ListItem: FC<ListItemProps> = ({
  item,
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
    '& .MuiSvgIcon-root': { color: item.isActive ? 'action.active' : 'action.disabled' }
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
  const handleAction = (actionId: string) => onContextualMenuClick && onContextualMenuClick(actionId, item.id);
    
  //EDIT
  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => onNameChange(e.target.value, item.id);
  const handleColorChange = (color: {hex: string}) => onColorChange(`#${color.hex}`, item.id);
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
            value={item.color}
            inputFormats={[]}
            onChange={handleColorChange}
          />
          :
          <Box sx={{width: 24, height: 24, bgcolor: item.color, borderRadius: 1, mx: 0.75}}/>
      }

    </ListItemIcon>
    {
      isEditing ?
        <TextField size='small' label='' variant='outlined' sx={{mr: 1, flexGrow: 1}}
          key='listItem'
          error={item.name.length < 1}
          inputRef={input => input && input.focus()}
          onChange={handleNameChange} 
          onBlur={handleBlur} 
          onKeyDown={handleInputOut}
          defaultValue={item.name}
        />
        :
        <TextField size='small' label='' variant='outlined' sx={noEditableTextField}
          onClick={() => onClick(item.id)}
          inputProps={{ readOnly: true }}
          defaultValue={item.name}
        />
    }
    {
      !isEditing && actionIcons?.map(i =>
        <IconButton key={i.id} onClick={() => onActionClick(item.id, i?.id)} sx={actionIconSx}>
          {item.isActive ? i.activeIcon : i.inactiveIcon}
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
};

export default ListItem;
