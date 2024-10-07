import React from 'react';
import AddButton from './AddButton';

//MUI-ICONS
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';

import AddTrack from '../icons/AddTrack';

export default {
  title: 'Buttons/AddButton',
  component: AddButton,
};

export const Scope = {
  args: {
    children: <CreateNewFolderIcon />,
  },
};

export const Point = {
  args: {
    ...Scope.args,
    children: <AddLocationAltIcon />,
  },
};

export const Track = {
  args: {
    ...Scope.args,
    children: <AddTrack />,
  },
};
