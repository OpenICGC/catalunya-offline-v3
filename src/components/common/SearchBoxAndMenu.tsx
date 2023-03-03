import React, {FC, useState} from 'react';

//MUI
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';

//MUI-ICONS
import InfoIcon from '@mui/icons-material/Info';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SettingsIcon from '@mui/icons-material/Settings';

//GEOCOMPONENTS
import SearchBox from '@geomatico/geocomponents/SearchBox';

//UTILS
import {useTranslation} from 'react-i18next';
import useTheme from '@mui/material/styles/useTheme';
import useEditingPosition from '../../hooks/useEditingPosition';
import useRecordingTrack from '../../hooks/useRecordingTrack';


//TYPES
export type SearchBoxAndMenuProps = {
  placeholder: string,
  isSearchBoxHidden: boolean,
  onContextualMenuClick?: (menuId: string) => void,
};

//STYLES
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
  isSearchBoxHidden,
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

  const searchSx = {
    '&.SearchBox-root': {
      transition: 'transform 360ms linear',
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
  };

  const searchHiddenSx = {
    ...searchSx,
    transform: 'translateY(-100px)'
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
      sx={isSearchBoxHidden ? searchHiddenSx: searchSx}
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
