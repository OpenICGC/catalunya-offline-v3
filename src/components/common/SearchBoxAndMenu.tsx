import React, {FC, useState} from 'react';

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

const BASE_URL = 'https://www.instamaps.cat/geocat/aplications/map/search.action';

//TYPES
export type SearchBoxAndMenuProps = {
  placeholder: string,
  isSearchBoxHidden: boolean,
  onContextualMenuClick?: (menuId: string) => void
};

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
  zIndex: 1001
});

const listSx = {
  overflow: 'auto',
  maxHeight: 300,
  cursor: 'pointer'
};

const SearchBoxAndMenu: FC<SearchBoxAndMenuProps> = ({
  placeholder,
  isSearchBoxHidden,
  onContextualMenuClick = () => undefined
}) => {
  const {t} = useTranslation();
  const theme = useTheme();
  const {setViewport} = useViewport();

  const isEditingPosition = !!useEditingPosition().position;
  const isRecordingTrack = useRecordingTrack().isRecording;
  const isHeaderVisible = isEditingPosition || isRecordingTrack;

  //SEARCH
  const [text, setText] = useState('');
  const [results, setResults] = useState<Array<ContextMapsResult>>([]);

  const clearResults = () => setResults([]);

  const handleTextChange = (newText: string) => {
    setText(newText);
    clearResults();
  };
  const handleSearchClick = () => {
    const url = `${BASE_URL}?searchInput=${text}`;
    fetch(url)
      .then(res => res.json())
      .then(res => JSON.parse(res.resposta))
      .then(res => setResults(res.resultats));
  };

  const handleResultClick = (result: ContextMapsResult) => {
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

  const resultsSx = {
    position: 'absolute',
    top: 48,
    zIndex: 1000,
    m: 1,
    maxWidth: {
      xs: `calc(100% - ${theme.spacing(2)})`,
      md: '30vw'
    },
    right: 0,
    borderRadius: 3
  };

  const renderResults = () => results.map((result, index) => (
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

  return <>
    <SearchBox
      id="search-box"
      text={text}
      AdvanceSearchIcon={MoreVertIcon}
      onAdvanceSearchClick={handleContextualMenu}
      onTextChange={handleTextChange}
      onSearchClick={handleSearchClick}
      placeholder={placeholder}
      sx={isSearchBoxHidden ? searchHiddenSx : searchSx}
    />

    {
      results.length
        ? <Paper elevation={3} sx={resultsSx}>
          <ClickAwayListener onClickAway={clearResults}>
            <List dense sx={listSx}>{renderResults()}</List>
          </ClickAwayListener>
        </Paper>
        : null
    }
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
