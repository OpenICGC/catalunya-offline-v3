import React, {FC, useCallback, useEffect, useState} from 'react';

//MUI
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
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
import SearchBox from '@geomatico/geocomponents/Search/SearchBox';

//UTILS
import ClickAwayListener from '@mui/material/ClickAwayListener';
import {useTranslation} from 'react-i18next';
import useTheme from '@mui/material/styles/useTheme';
import useEditingPosition from '../../hooks/singleton/useEditingPosition';
import useRecordingTrack from '../../hooks/singleton/useRecordingTrack';
import {useStatus} from '@capacitor-community/network-react';
import {ContextMapsResult} from '../../types/commonTypes';

const BASE_URL = 'https://www.instamaps.cat/geocat/aplications/map/search.action';

//STYLES
const contextualMenuSx = (isHeaderVisible: boolean) => ({
  mt: 1,
  boxShadow: 5,
  position: 'absolute',
  top: isHeaderVisible ? 96 : 48,
  right: 8,
  zIndex: 1201,
  transition: 'transform 360ms linear',
});

const contextualMenuHiddenSx = (isHeaderVisible: boolean) => ({
  ...contextualMenuSx(isHeaderVisible),
  transform: 'translateY(-100px)'
});

const listSx = (componentWidth: object) => ({
  overflow: 'auto',
  maxHeight: 300,
  cursor: 'pointer',
  width: componentWidth
});

export type SearchBoxAndMenuProps = {
  isContextualMenuOpen: boolean,
  isHidden?: boolean,
  onContextualMenuClick?: (menuId: string) => void,
  onResultClick: (result: ContextMapsResult) => void,
  onToggleContextualMenu: () => void
};

const SearchBoxAndMenu: FC<SearchBoxAndMenuProps> = ({
  isContextualMenuOpen,
  isHidden = false,
  onContextualMenuClick = () => undefined,
  onResultClick,
  onToggleContextualMenu
}) => {
  const {t} = useTranslation();
  const theme = useTheme();
  const {networkStatus} = useStatus();
  
  //STYLES
  const componentWidth = {
    xs: `calc(100% - ${theme.spacing(2)})`,
    md: '30vw'
  };
  
  //CONNECTIVITY
  const hasConnectivity = networkStatus?.connected;
  const isEditingPosition = useEditingPosition().isEditing;
  const isRecordingTrack = useRecordingTrack().isRecording;
  const isHeaderVisible = isEditingPosition || isRecordingTrack;

  //SEARCH
  const [text, setText] = useState('');
  const [results, setResults] = useState<Array<ContextMapsResult>>([]);
  const [showConnectivityError, setConnectivityError] = useState(false);

  const clearResults = () => setResults([]);

  useEffect(() => {
    if (hasConnectivity) {
      setConnectivityError(false);
    } else {
      clearResults();
    }
  }, [hasConnectivity]);

  const handleTextChange = useCallback((newText: string) => {
    if (isContextualMenuOpen) {
      onToggleContextualMenu();
    }
    setText(newText);
    clearResults();
  }, [isContextualMenuOpen]);

  const handleSearchClick = useCallback(() => {
    if (hasConnectivity) {
      setConnectivityError(false);
      const url = `${BASE_URL}?searchInput=${text}`;
      fetch(url)
        .then(res => res.json())
        .then(res => JSON.parse(res.resposta))
        .then(res => setResults(res.resultats));
    } else setConnectivityError(true);
  }, [hasConnectivity, text]);

  //CONTEXTUAL MENU

  const handleAction = (actionId: string) => {
    onToggleContextualMenu();
    onContextualMenuClick(actionId);
  };

  const searchSx = {
    '&.SearchBox-root': {
      transition: 'transform 360ms linear',
      zIndex: 1,
      position: 'absolute',
      top: isHeaderVisible ? 48 : 0,
      m: 1,
      maxWidth: componentWidth,
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

  const resultsSx = {
    position: 'absolute',
    transition: 'transform 360ms linear',
    top: 48,
    zIndex: 1100,
    m: 1,
    maxWidth: {
      xs: `calc(100% - ${theme.spacing(2)})`,
      md: '30vw'
    },
    right: 0,
    borderRadius: 3
  };

  const resultsHiddenSx = {
    ...resultsSx,
    transform: 'translateY(-100px)'
  };

  const renderResults = results.map((result, index) => (
    <ListItem
      dense
      key={index}
      onClick={() => {
        onResultClick(result);
        clearResults();
        setText('');
      }}
      sx={{
        width: '100%',
        '&:hover': {
          bgcolor: 'grey.100'
        }
      }}
    >
      <ListItemText
        primary={result.nom}
        primaryTypographyProps={{
          noWrap: true
        }}
      />
    </ListItem>
  ));

  const renderConnectivityError = (
    <ListItem dense>
      <ListItemText
        primary={t('errors.search.noConnectivity')}
        primaryTypographyProps={{
          noWrap: true,
          color: 'error.main'
        }}
      />
    </ListItem>
  );

  const placeholder = t('actions.search');
  const searchboxSx = isHidden ? searchHiddenSx : searchSx;
  const paperSx = isHidden || hasConnectivity ? resultsHiddenSx : resultsSx;

  return <>
    <SearchBox
      text={text}
      AdvanceSearchIcon={MoreVertIcon}
      onAdvanceSearchClick={onToggleContextualMenu}
      onTextChange={handleTextChange}
      onSearchClick={handleSearchClick}
      placeholder={placeholder}
      sx={searchboxSx}
    />
    {
      showConnectivityError ?
        <Paper elevation={3} sx={paperSx}>
          <ClickAwayListener onClickAway={clearResults}>
            <List dense sx={listSx(componentWidth)}>{renderConnectivityError}</List>
          </ClickAwayListener>
        </Paper> :
        results.length ?
          <Paper elevation={3} sx={resultsSx}>
            <ClickAwayListener onClickAway={clearResults}>
              <List dense sx={listSx(componentWidth)}>{renderResults}</List>
            </ClickAwayListener>
          </Paper>
          :  null
    }
    {
      isContextualMenuOpen && !isHidden && <Paper sx={isHidden ? contextualMenuHiddenSx(isHeaderVisible) : contextualMenuSx(isHeaderVisible)}>
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
export default React.memo(SearchBoxAndMenu);
