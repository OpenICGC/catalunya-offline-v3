import React, {FC, ReactNode} from 'react';
import PropTypes from 'prop-types';

//MUI
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

//UTILS
import {useTranslation} from 'react-i18next';
import {Theme} from '@mui/material';

export type ManagerHeaderProps = {
  name: string,
  color: string,
  startIcon: ReactNode,
}

const ManagerHeader: FC<ManagerHeaderProps> = ({name, color = 'primary', startIcon}) => {
  const {t} = useTranslation();
  //STYLES
  const appBarSx = {
    display: 'flex',
    flexFlow: 'row noWrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
    bgcolor: color || 'secondary.main',
    pl: 1,
    height: '54px',
    '& .MuiSvgIcon-root': {
      color: (theme: Theme) => theme.palette.getContrastText(color)
    }
  };

  const toolbarSx = {
    px: 1,
    display: 'flex',
    justifyContent: 'baseline',
    '@media (min-width: 600px)': {
      pl: 1,
    },
  };

  const scopeNameSx = {
    color: (theme: Theme) => theme.palette.getContrastText(color),
    width: '180px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    letterSpacing: '0.0075em',
    fontWeight: 500
  };

  return <AppBar position="static" sx={appBarSx}>
    {startIcon}
    <Toolbar variant='dense' sx={toolbarSx}>
      <Typography variant='h2' component='h3' sx={scopeNameSx}>{t(name)}</Typography>
    </Toolbar>
  </AppBar>;
};

ManagerHeader.propTypes = {
  name: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  startIcon: PropTypes.node,
};

export default ManagerHeader;