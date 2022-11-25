import React, {FC, ReactNode} from 'react';

//MUI
import {Theme} from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

//UTILS
import {useTranslation} from 'react-i18next';

export type ManagerHeaderProps = {
  name: string,
  color: string,
  startIcon: ReactNode
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
    pl: 1.5,
    height: '48px',
    '& .MuiSvgIcon-root': {
      color: (theme: Theme) => theme.palette.getContrastText(color)
    }
  };

  const toolbarSx = {
    px: 1,
    display: 'flex',
    justifyContent: 'baseline',
    pl: 0,
    pr: 0,
    '@media (min-width: 600px)': {
      pl: 0,
      pr: 0
    }
  };

  const scopeNameSx = {
    color: (theme: Theme) => theme.palette.getContrastText(color),
    width: '180px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontWeight: 500,
    pl: 1.5
  };

  return <AppBar position="static" sx={appBarSx} elevation={0}>
    <Toolbar variant='dense' sx={toolbarSx}>
      {startIcon}
      <Typography variant='h2' component='h3' sx={scopeNameSx}>{t(name)}</Typography>
    </Toolbar>
  </AppBar>;
};

export default ManagerHeader;