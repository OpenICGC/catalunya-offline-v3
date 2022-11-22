import React, {useState} from 'react';
import PropTypes from 'prop-types';

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

const EntityListItem = ({
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
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleContextualMenu = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleAction = (actionId) => actionId === 'rename' ?
    setIsEditing(true) :
    onContextualMenuClick(actionId, id);

  //EDIT
  const handleNameChange = (e) => onNameChange(e.target.value, id);
  const handleColorChange = (color) => onColorChange(`#${color.hex}`, id);
  const handleBlur = () => {
    setAnchorEl(null);
    setIsEditing(false);
  };
  const handleInputOut = (e) => {
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
        sx={{'& .ColorPicker-MuiButtonBase-root': {border: '2px solid red'}}}
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
        : <ListItemText primary={name} sx={{mt: 1, ml: isEditing && 1, cursor: 'pointer'}} onClick={() => onClick(id)}/>
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
          dense='true'
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

EntityListItem.propTypes = {
  actionIcon: PropTypes.element,
  color: PropTypes.string,
  contextualMenu: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    icon: PropTypes.element,
  })),
  id: PropTypes.string.isRequired,
  isEditing: PropTypes.bool,
  name: PropTypes.string.isRequired,
  onActionClick: PropTypes.func,
  onClick: PropTypes.func,
  onColorChange: PropTypes.func,
  onContextualMenuClick: PropTypes.func,
  onNameChange: PropTypes.func,
};

export default EntityListItem;

