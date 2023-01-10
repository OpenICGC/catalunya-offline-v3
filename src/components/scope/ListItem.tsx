import React, {KeyboardEvent, FC, ChangeEvent, SyntheticEvent, useState, ReactNode, memo, useMemo} from 'react';

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
import {ColorFormat, ColorPicker} from 'material-ui-color';
import {HEXColor, UUID} from '../../types/commonTypes';
import Box from '@mui/material/Box';
import {ClickAwayListener} from '@mui/material';

const muiListItemSx = {height: '48px', p: 0, m: 0};
const listItemIconSx = {minWidth: '24px', p: 0};

const inputFormats: ColorFormat[] = [];

const textFieldSx = {mr: 1, flexGrow: 1};

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

export type ListItemProps = {
  itemId: UUID,
  name: string,
  color: HEXColor,
  isActive?: boolean,
  isEditing?: boolean,
  actionIcons?: Array<{ id: string, activeIcon: ReactNode, inactiveIcon?: ReactNode, disabled?: boolean }>,
  contextualMenu?: Array<{ id: string, label: string, icon?: ReactNode }>,
  onActionClick: (itemId: UUID, actionId: string) => void,
  onClick?: (itemId: UUID) => void,
  onColorChange?: (itemId: UUID, color: HEXColor) => void,
  onContextualMenuClick?: (itemId: UUID, menuId: string) => void,
  onNameChange?: (itemId: UUID, name: string) => void,
  onStopEditing?: () => void
}

// eslint-disable-next-line react/display-name
const ListItem: FC<ListItemProps> = memo(({
  itemId,
  name,
  color,
  isActive = true,
  isEditing = false,
  actionIcons = [],
  contextualMenu = [],
  onActionClick,
  onClick = () => undefined,
  onColorChange = () => undefined,
  onContextualMenuClick = () => undefined,
  onNameChange = () => undefined,
  onStopEditing = () => undefined
}) => {
  const {t} = useTranslation();

  //STYLES
  const actionIconSx = useMemo(() => ({
    m: 0,
    p: 0.5,
    '& ..MuiIconButton-root': { color: isActive ? 'action.active' : 'action.disabled' },
    '&.Mui-disabled': {color: 'action.disabled'}
  }), [isActive]);

  const colorBoxSx = useMemo(() => ({
    width: 24, height: 24, bgcolor: color, borderRadius: 1, mx: 0.75
  }), [color]);
  
  //CONTEXTUAL MENU
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleContextualMenu = (e: SyntheticEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleAction = (actionId: string) => onContextualMenuClick(itemId, actionId);

  //EDIT
  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => onNameChange(itemId, e.target.value);
  const handleColorChange = (color: {hex: string}) => onColorChange(itemId, `#${color.hex}`);

  // Stop editing
  const handleClickAway = () =>
    isEditing && stopEditing();
  const handleEnterStopsEditing = (e: KeyboardEvent<HTMLInputElement>) =>
    e.key === 'Enter' && stopEditing();
  const stopEditing = () => {
    setAnchorEl(null);
    onStopEditing();
  };
  
  return <ClickAwayListener onClickAway={handleClickAway}>
    <MuiListItem sx={muiListItemSx}>
      <ListItemIcon sx={listItemIconSx}>
        { isEditing ?
          <ColorPicker
            hideTextfield
            disableAlpha
            value={color}
            inputFormats={inputFormats}
            onChange={handleColorChange}
          />
          :
          <Box sx={colorBoxSx}/>
        }
      </ListItemIcon>
      { isEditing ?
        <TextField size='small' label='' variant='outlined' sx={textFieldSx}
          key='listItem'
          error={name.length < 1}
          inputRef={input => input && input.focus()}
          onChange={handleNameChange}
          onKeyDown={handleEnterStopsEditing}
          value={name}
        />
        :
        <>
          <TextField size='small' label='' variant='outlined' sx={noEditableTextField}
            onClick={() => onClick(itemId)}
            inputProps={{ readOnly: true }}
            defaultValue={name}
          />
          {
            actionIcons?.map(actionIcon =>
              <IconButton key={actionIcon.id} onClick={() => onActionClick(itemId, actionIcon?.id)} sx={actionIconSx} disabled={actionIcon.disabled}>
                {isActive ? actionIcon.activeIcon : actionIcon.inactiveIcon}
              </IconButton>
            )
          }
          {contextualMenu.length ? <>
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
          </> : null}
        </>
      }
    </MuiListItem>
  </ClickAwayListener>;
});

export default ListItem;
