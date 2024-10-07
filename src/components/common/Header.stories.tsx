import React from 'react';
import { StoryFn } from '@storybook/react';

import Header, { HeaderProps } from './Header';
import FolderIcon from '@mui/icons-material/Folder';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { DRAWER_WIDTH } from '../../config';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import RouteIcon from '@mui/icons-material/Route';
import Box from '@mui/material/Box';
import ArrowBackIcon from '@mui/icons-material/DoubleArrow';
import { Theme } from '@mui/material/styles/createTheme';

export default {
  title: 'Common/Header',
  component: Header,
  argTypes: {
    color: { control: 'color' },
  },
};

//STYLES
const detailTextSx = {
  color: (theme: Theme) => theme.palette.getContrastText('#973572'),
  ml: 0.5,
  fontWeight: 'bold',
};
const detailIconSx = {
  color: (theme: Theme) => theme.palette.getContrastText('#973572'),
};
const childrenContainer = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  ml: 'auto',
};

const DeviceTemplate: StoryFn<HeaderProps> = (args) => (
  <Stack
    sx={{
      height: '500px',
      width: DRAWER_WIDTH,
      boxShadow: 3,
      overflow: 'hidden',
      m: 0,
      p: 0,
    }}
  >
    <Header {...args} />
  </Stack>
);

export const ManagerHeader = {
  render: DeviceTemplate,

  args: {
    name: 'Ámbitos',
    startIcon: <FolderIcon />,
    color: '#973572',
  },
};

export const ScopeHeader = {
  render: DeviceTemplate,

  args: {
    name: 'Montseny con amigos',
    startIcon: <ArrowBackIcon sx={{ transform: 'rotate(180deg)' }} />,
    color: '#fc5252',
    children: (
      <Box sx={childrenContainer}>
        <Typography variant="caption" sx={detailTextSx}>
          {15}
        </Typography>
        <LocationOnIcon fontSize="small" sx={detailIconSx} />
        <Typography variant="caption" sx={detailTextSx}>
          {7}
        </Typography>
        <RouteIcon fontSize="small" sx={detailIconSx} />
      </Box>
    ),
    sx: {
      '& .Header-name': {
        fontSize: '16px',
      },
    },
  },
};

export const RecordingHeader = {
  render: DeviceTemplate,

  args: {
    name: 'Grabando...',
    startIcon: <FiberManualRecordIcon />,
    color: '#973572',
    children: <Typography>03:52:12</Typography>,
  },
};
