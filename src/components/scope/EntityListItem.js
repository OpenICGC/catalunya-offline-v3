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
import {MuiColorInput} from 'mui-color-input';

//MUI-ICONS
import MoreVertIcon from '@mui/icons-material/MoreVert';

//UTILS
import {useTranslation} from 'react-i18next';

//STYLES
const colorPickerSx = {
  width: '16px',
  '& .MuiInputAdornment-root': {},
  '& .MuiButton-root': {borderRadius: '0px', width: '12px', height: '36px'},
  '& .MuiInput-input': {visibility: 'hidden'}
};

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
  const handleAction = (actionId) => actionId === 'edit' ?
    setIsEditing(true) :
    onContextualMenuClick(actionId, id);

  //EDIT
  const handleNameChange = (e) => onNameChange(e.target.value);
  const handleColorChange = (color, format) => onColorChange(format.hex);
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
  
  return <ListItem sx={{py: 1, pr: 0}}>
    <ListItemIcon sx={{minWidth: '32px'}}>
      <MuiColorInput
        value={color}
        onChange={handleColorChange}
        isAlphaHidden
        variant='standard'
        InputProps={{disableUnderline: true}}
        sx={colorPickerSx}/>
    </ListItemIcon>
    {
      isEditing ?
        <TextField size='small' label={t('scopeListItem.name')} variant='outlined' sx={{mr: 1, flexGrow: 1}}
          inputRef={input => input && input.focus()}
          onChange={handleNameChange} 
          onBlur={handleBlur} 
          onKeyDown={handleInputOut}
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
                <ListItemText>{label}</ListItemText>
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
  id: PropTypes.number.isRequired,
  isEditing: PropTypes.bool,
  name: PropTypes.string.isRequired,
  onActionClick: PropTypes.func,
  onClick: PropTypes.func,
  onColorChange: PropTypes.func,
  onContextualMenuClick: PropTypes.func,
  onNameChange: PropTypes.func,
};

export default EntityListItem;

