import React, {FC, useState} from 'react';

import SearchBox from '@geomatico/geocomponents/SearchBox';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SettingsIcon from '@mui/icons-material/Settings';
import InfoIcon from '@mui/icons-material/Info';
import {useTranslation} from 'react-i18next';
import Paper from '@mui/material/Paper';
import useTheme from '@mui/material/styles/useTheme';

//TYPES
export type SearchBoxAndMenuProps = {
  placeholder: string,
  onContextualMenuClick?: (menuId: string) => void,
};

const contextualMenu = [
  {
    id: 'settings',
    label: 'Ajustes',
    icon: <SettingsIcon/>
  },
  {
    id: 'about',
    label: 'Acerca de...',
    icon: <InfoIcon/>
  }
];

const contextualMenuSx = {
  mt: 1,
  boxShadow: 5,
  position: 'absolute',
  top: 48,
  right: 8,
  zIndex: 1001
};

const SearchBoxAndMenu: FC<SearchBoxAndMenuProps> = ({
  placeholder,
  onContextualMenuClick = () => undefined,
}) => {
  const {t} = useTranslation();
  const theme = useTheme();

  //STYLES
  const searchSx = {
    '&.SearchBox-root': {
      zIndex: 1001,
      position: 'absolute',
      m: 1,
      maxWidth: {
        xs: `calc(100% - ${theme.spacing(2)})`,
        md: '30vw'
      },
      right: 0
    }
  };

  //CONTEXTUAL MENU
  const [isOpen, setIsOpen] = useState(false);
  const handleContextualMenu = () => setIsOpen(!isOpen);
  const handleAction = (actionId: string) => {
    setIsOpen(false);
    onContextualMenuClick(actionId);
  };
  return <>
    <SearchBox
      id='search-box'        
      AdvanceSearchIcon={MoreVertIcon}
      onAdvanceSearchClick={handleContextualMenu}
      onTextChange={() => console.log('writing')}
      onSearchClick={() => console.log('search')}
      placeholder={placeholder}
      sx={searchSx}
    />
    {
      isOpen && <Paper sx={contextualMenuSx}>
        <MenuList dense sx={{p: 0}}>
          {
            contextualMenu?.map(({id, label, icon}) => <MenuItem key={id} onClick={() => handleAction(id)}>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText>{t(label)}</ListItemText>
            </MenuItem>
            )
          }
        </MenuList>
      </Paper>
    }
  </>;
};
export default SearchBoxAndMenu;
