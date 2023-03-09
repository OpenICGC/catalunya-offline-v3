import React, {FC, useEffect, useState} from 'react';

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
import {ClickAwayListener} from '@mui/material';
import {useViewport} from '../../hooks/useViewport';
import {useTranslation} from 'react-i18next';
import useTheme from '@mui/material/styles/useTheme';
import useEditingPosition from '../../hooks/useEditingPosition';
import useRecordingTrack from '../../hooks/useRecordingTrack';
import {useStatus} from '@capacitor-community/network-react';

const BASE_URL = 'https://www.instamaps.cat/geocat/aplications/map/search.action';

//TYPES
type ContextMapsResult = {
  nom: string,
  coordenades: string
}

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

const listSx = {
  overflow: 'auto',
  maxHeight: 300,
  cursor: 'pointer',
  width: '500px'
};

export type SearchBoxAndMenuProps = {
  isContextualMenuOpen: boolean,
  placeholder: string,
  isHidden?: boolean,
  onContextualMenuClick?: (menuId: string) => void,
  toogleContextualMenu: () => void
};

const SearchBoxAndMenu: FC<SearchBoxAndMenuProps> = ({
  isContextualMenuOpen,
  placeholder,
  isHidden = false,
  onContextualMenuClick = () => undefined,
  toogleContextualMenu
}) => {
  const {t} = useTranslation();
  const theme = useTheme();
  const {setViewport} = useViewport();
  const {networkStatus} = useStatus();

  //CONNECTIVITY
  const hasConnectivity = networkStatus?.connected;
  const isEditingPosition = !!useEditingPosition().position;
  const isRecordingTrack = useRecordingTrack().isRecording;
  const isHeaderVisible = isEditingPosition || isRecordingTrack;

  //SEARCH
  const [text, setText] = useState('');
  const [results, setResults] = useState<Array<ContextMapsResult>>([]);
  const [showConnectivityError, setConnectivityError] = useState(false);

  useEffect(() => {
    if(hasConnectivity) {
      setConnectivityError(false);
    } else setResults([]);
  }, [hasConnectivity]);

  const clearResults = () => setResults([]);

  const handleTextChange = (newText: string) => {
    setText(newText);
    clearResults();
  };

  const handleSearchClick = () => {
    if (hasConnectivity) {
      setConnectivityError(false);
      const url = `${BASE_URL}?searchInput=${text}`;
      fetch(url)
        .then(res => res.json())
        .then(res => JSON.parse(res.resposta))
        .then(res => setResults(res.resultats));
    } else setConnectivityError(true);
  };

  const handleResultClick = (result: ContextMapsResult) => {
    toogleContextualMenu();
    const coords = result.coordenades.split(',');
    setViewport({
      latitude: parseFloat(coords[1]),
      longitude: parseFloat(coords[0]),
      zoom: 14
    });
    clearResults();
    setText('');
  };

  //CONTEXTUAL MENU
  const handleContextualMenu = () => toogleContextualMenu();
  const handleAction = (actionId: string) => {
    toogleContextualMenu();
    onContextualMenuClick(actionId);
  };

  const searchSx = {
    '&.SearchBox-root': {
      transition: 'transform 360ms linear',
      zIndex: 1200,
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
      onClick={() => handleResultClick(result)}
      sx={{
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

  return <>
    <SearchBox
      text={text}
      AdvanceSearchIcon={MoreVertIcon}
      onAdvanceSearchClick={handleContextualMenu}
      onTextChange={handleTextChange}
      onSearchClick={handleSearchClick}
      placeholder={placeholder}
      sx={isHidden ? searchHiddenSx : searchSx}
    />
    {
      showConnectivityError ?
        <Paper elevation={3} sx={isHidden || hasConnectivity ? resultsHiddenSx : resultsSx}>
          <ClickAwayListener onClickAway={clearResults}>
            <List dense sx={listSx}>{renderConnectivityError}</List>
          </ClickAwayListener>
        </Paper> :
        results.length ?
          <Paper elevation={3} sx={resultsSx}>
            <ClickAwayListener onClickAway={clearResults}>
              <List dense sx={listSx}>{renderResults}</List>
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
export default SearchBoxAndMenu;
