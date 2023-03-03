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
import {Theme} from '@mui/material';
import useEditingPosition from '../../hooks/useEditingPosition';
import useRecordingTrack from '../../hooks/useRecordingTrack';

//TYPES
export type SearchBoxAndMenuProps = {
  placeholder: string,
  onContextualMenuClick?: (menuId: string) => void,
};

//STYLES
const searchSx = (theme: Theme, isHeaderVisible: boolean) => ({
  '&.SearchBox-root': {
    zIndex: 1001,
    position: 'absolute',
    top: isHeaderVisible ? 48 : 0,
    m: 1,
    maxWidth: {
      xs: `calc(100% - ${theme.spacing(2)})`,
      md: '30vw'
    },
    right: 0
  }
});

const contextualMenuSx = (isHeaderVisible: boolean) => ({
  mt: 1,
  boxShadow: 5,
  position: 'absolute',
  top: isHeaderVisible ? 96 : 48,
  right: 8,
  zIndex: 1001
});

const SearchBoxAndMenu: FC<SearchBoxAndMenuProps> = ({
  placeholder,
  onContextualMenuClick = () => undefined,
}) => {
  const {t} = useTranslation();
  const theme = useTheme();

  const isEditingPosition = !!useEditingPosition().position;
  const isRecordingTrack = useRecordingTrack().isRecording;
  const isHeaderVisible = isEditingPosition || isRecordingTrack;

  //CONTEXTUAL MENU
  const [isOpen, setIsOpen] = useState(false);
  const handleContextualMenu = () => setIsOpen(!isOpen);
  const handleAction = (actionId: string) => {
    setIsOpen(false);
    onContextualMenuClick(actionId);
  };

  const contextualMenu = [
    {
      id: 'settings',
      label: t('settings.title'),
      icon: <SettingsIcon/>
    },
    {
      id: 'about',
      label: t('about.title'),
      icon: <InfoIcon/>
    }
  ];
  
  return <>
    <SearchBox
      id='search-box'        
      AdvanceSearchIcon={MoreVertIcon}
      onAdvanceSearchClick={handleContextualMenu}
      onTextChange={() => console.log('writing')}
      onSearchClick={() => console.log('search')}
      placeholder={placeholder}
      sx={searchSx(theme, isHeaderVisible)}
    />
    {
      isOpen && <Paper sx={contextualMenuSx(isHeaderVisible)}>
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
