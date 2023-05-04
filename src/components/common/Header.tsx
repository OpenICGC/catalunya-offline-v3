import React, {FC, ReactElement, ReactNode} from 'react';
import {HEXColor} from '../../types/commonTypes';
import {SxProps} from '@mui/system/styleFunctionSx/styleFunctionSx';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import AppBar, {AppBarProps} from '@mui/material/AppBar';

import styled from '@mui/material/styles/styled';
import {useTranslation} from 'react-i18next';

const classes = {
  root: 'Header-root',
  toolBar: 'Header-toolBar',
  startIcon: 'Header-startIcon',
  name: 'Header-name'
};

export interface RootProps extends AppBarProps {
  colorHeader: HEXColor
}

const Root = styled(AppBar,
  {shouldForwardProp: (prop) => prop !== 'colorHeader'}
)<RootProps>(({colorHeader, theme}) => {
  return {
    '&.Header-root': {
      backgroundColor: colorHeader || theme.palette.secondary.main,
      height: '48px',
      zIndex: 2,
    },
    '& .Header-toolBar': {
      padding: '16px',
      '@media (min-width: 600px)': {
        '& .MuiToolbar-root': {
          padding: '16px',
        }
      }
    },
    '.Mui-disabled': {
      color: theme.palette.getContrastText(colorHeader),
    },
    '& .Header-startIcon': {
      color: theme.palette.getContrastText(colorHeader),

      '& .MuiSvgIcon-root': {
        color: theme.palette.getContrastText(colorHeader),
      }
    },
    '& .Header-name': {
      color: theme.palette.getContrastText(colorHeader),
      flexGrow: 1,
      width: '80vw',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    }
  };
});



export interface HeaderProps {
  name: string,
    color: HEXColor,
    startIcon: ReactElement,
    children?: ReactNode,
    onStartIconClick?: () => void,
    sx?: SxProps,
}

const Header: FC<HeaderProps> = ({
  name,
  color,
  startIcon,
  children,
  onStartIconClick,
  sx
}) => {

  const {t} = useTranslation();

  const handleStartIconClick = () => onStartIconClick && onStartIconClick();

  return <Root className={classes.root} colorHeader={color} sx={sx} elevation={0} position='static'>
    <Toolbar variant='dense' className={classes.toolBar}>
      <IconButton size='large' edge='start' className={classes.startIcon} onClick={handleStartIconClick} disabled={!onStartIconClick}>
        {startIcon}
      </IconButton>
      <Typography variant='h2' component='h3' className={classes.name}>{t(name)}</Typography>
      {children}
    </Toolbar>
  </Root>;
};

export default React.memo(Header);
