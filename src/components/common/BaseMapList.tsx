import React, {FC, useMemo} from 'react';
import {styled, Theme} from '@mui/material/styles';

//MUI
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

//MUI-ICONS
import DeleteIcon from '@mui/icons-material/Delete';

//UTILS
import {DRAWER_WIDTH} from '../../config';
import {useTranslation} from 'react-i18next';
import {BaseMaps, Styles} from '../../types/commonTypes';

const thumbnailWidth = DRAWER_WIDTH-20;
const thumbnailHeight = 60;
const itemWidth = DRAWER_WIDTH-20;

const classes = {
  root: 'LayerSwitcher-root',
  item: 'LayerSwitcher-item',
  thumbnail: 'LayerSwitcher-thumbnail',
  text: 'LayerSwitcher-text',
  attributtion: 'LayerSwitcher-attributtion',
  selected: 'LayerSwitcher-selected'
};

const Root = styled(Stack,
  {shouldForwardProp: (prop) => prop !== 'theme'}
)<{theme:  Theme | undefined}>
(({theme} ) => ({
  '&.LayerSwitcher-root': {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: '16px'
  },
  '& .LayerSwitcher-item': {
    flexDirection: 'column',
    margin: '0px 8px 16px 8px',
    padding: '0px',
    width: itemWidth
  },
  '& .LayerSwitcher-thumbnail': {
    borderRadius: 4,
    margin: '0 0 4px 0',
    padding: 0,
    width: thumbnailWidth,
    height: thumbnailHeight,
    '&:hover': {
      border: `2px solid ${theme.palette.primary.main}`,
    },
    '&.LayerSwitcher-selected': {
      border: `2px solid ${theme.palette.primary.main}`,
    },
  },
  '& .LayerSwitcher-text': {
    letterSpacing: 0,
    textAlign: 'left',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: '2',
    WebkitBoxOrient: 'vertical',
    width: '100%',
    color: theme.palette.grey[700],
    //marginTop: '8px',
    '&.LayerSwitcher-selected': {
      color: theme.palette.primary.main,
    },
  }
}));

export type BaseMapListProps = {
  coreStyles: BaseMaps,
  userStyles?: BaseMaps,
  selectedStyleId: string,
  onStyleChange: (newStyle: string)=> void,
  onStyleDelete: (newStyle: string)=> void
}

const baseMapManagerSx = {
  width: '100%',
  px: 1.5,
  my: 2,
  py: 1,
  bgcolor: 'grey.200',
  color: 'grey.700'
};

const attributionSx = {
  color: 'grey',
  textAlign: 'left',
  fontSize: '10px'
};

const deleteButtonSx = {
  color: 'grey.600',
  py: 0,
  '&:hover': {
    bgcolor: 'transparent'
  }
};

const BaseMapList: FC<BaseMapListProps> = ({coreStyles, userStyles, selectedStyleId, onStyleChange, onStyleDelete}) => {
  const {t, i18n} = useTranslation();

  const formatStyle = (styles: BaseMaps) => useMemo(() =>
    styles.map((basemap) => ({
      ...basemap,
      label: basemap.labels[i18n.language.split('-')[0]]
    }))
  , []);

  const coreStylesFormatted = formatStyle(coreStyles);
  const userStylesFormatted = userStyles && formatStyle(userStyles);

  const handleClick = (id: string) => () => onStyleChange(id);
  const handleDelete = (id: string) => () => onStyleDelete(id);
  
  const renderStyles = (styles: Styles) => {
    return styles.map((style, index) => (
      <Stack key={`${styles === userStylesFormatted && 'user'}-${index}`} alignItems='flex-start' className={classes.item} onClick={handleClick(style.id)}>
        <Avatar variant='square' alt={style.label} src={style.thumbnail}
          className={`${classes.thumbnail} ${selectedStyleId === style.id ? classes.selected : ''}`}
        />
        <Box display='flex' flexDirection='row' justifyContent='space-between' width='100%'>
          <Typography variant='body2'
            className={`${classes.text} ${selectedStyleId === style.id ? classes.selected : ''}`}>
            {style.label}
          </Typography>
          {
            styles === userStylesFormatted && <IconButton onClick={handleDelete(style.id)} sx={deleteButtonSx}>
              <DeleteIcon fontSize='small'/>
            </IconButton>
          }
        </Box>
        {
          style.attribution && <Typography
            component='p'
            sx={attributionSx}
          >
            {`© ${style.attribution}`}
          </Typography>}
      </Stack>
    ));
  };

  return <Root direction='row' className={classes.root} theme={undefined}>
    {
      renderStyles(coreStylesFormatted)
    }
    {
      userStylesFormatted && <Typography variant='body2' sx={baseMapManagerSx}>
        {t('baseMapManager.userStyles').toUpperCase()}
      </Typography>
    }
    {
      userStylesFormatted && renderStyles(userStylesFormatted)
    }
  </Root>;
};

export default BaseMapList;