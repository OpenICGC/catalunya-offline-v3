import React, { useCallback, useState } from 'react';
import List, { listItemType, ListProps } from './List';
import { StoryFn } from '@storybook/react';

//MUI
import Stack from '@mui/material/Stack';

//MUI-ICONS
import DashboardIcon from '@mui/icons-material/Dashboard';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FolderIcon from '@mui/icons-material/Folder';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import SwipeRightAltIcon from '@mui/icons-material/SwipeRightAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

//CATOFFLINE
import Header from '../common/Header';

//UTILS
import { DRAWER_WIDTH } from '../../config';
import { v4 as uuidv4 } from 'uuid';
import useColorRamp from '@geomatico/geocomponents/hooks/useColorRamp';
import { HEXColor, UUID } from '../../types/commonTypes';

const stackSx = {
  height: '500px',
  width: DRAWER_WIDTH,
  boxShadow: 3,
  overflow: 'hidden',
  m: 0,
  p: 0,
};

export default {
  title: 'Scope/List',
  component: List,
};

const DeviceTemplate: StoryFn<ListProps> = (args) => (
  <Stack sx={stackSx}>
    <List {...args} />
  </Stack>
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ManagedTemplate: StoryFn<ListProps> = ({items, onNameChange, onColorChange, ...args}) => {
  const [getItems, setItems] = useState<Array<listItemType>>(items);

  const handleColorChange = useCallback(
    (itemId: UUID, color: HEXColor) =>
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, color } : item,
        ),
      ),
    [],
  );

  const handleNameChange = useCallback(
    (itemId: UUID, name: string) =>
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, name } : item,
        ),
      ),
    [],
  );

  return (
    <Stack sx={stackSx}>
      <List
        items={getItems}
        onColorChange={handleColorChange}
        onNameChange={handleNameChange}
        {...args}
      />
    </Stack>
  );
};

const DeviceWithHeaderTemplate: StoryFn<ListProps> = (args) => (
  <Stack sx={stackSx}>
    <Header name="Ámbitos" color="#1b718c" startIcon={<FolderIcon />} />
    <List {...args} />
  </Stack>
);

const palette = useColorRamp('BrewerDark27').hexColors;

export const Default = {
  args: {
    items: [...Array(20).keys()].map((i) => ({
      id: uuidv4(),
      name: `Mi ámbito ${i}`,
      color: palette[i % palette.length],
    })),
    contextualMenu: [
      {
        id: 'edit',
        label: 'Editar',
        icon: <EditIcon />,
      },
      {
        id: 'delete',
        label: 'Borrar',
        icon: <DeleteIcon />,
      },
      {
        id: 'instamaps',
        label: 'Instamaps',
        icon: <MoreHorizIcon />,
      },
      {
        id: 'dataSchema',
        label: 'Esquema de datos',
        icon: <DashboardIcon />,
      },
    ],
    actionIcons: [
      {
        id: 'export',
        activeIcon: <FileUploadIcon />,
      },
    ],
    isLargeSize: false,
  },
};

export const Managed = {
  render: ManagedTemplate,

  args: {
    ...Default.args,
  },
};

export const Empty = {
  args: {
    ...Default.args,
    items: [],
  },
};

export const PointOrTrack = {
  args: {
    items: [...Array(20).keys()].map((i) => ({
      id: uuidv4(),
      name: `Mi punto o traza ${i}`,
      color: palette[Math.floor(Math.random() * palette.length)], // Color asignado la mitad de las veces
      isVisible: Math.random() < 0.5,
    })),
    contextualMenu: [
      {
        id: 'goTo',
        label: 'Ir a',
        icon: <SwipeRightAltIcon />,
      },
      {
        id: 'edit',
        label: 'Editar',
        icon: <EditIcon />,
      },
      {
        id: 'delete',
        label: 'Borrar',
        icon: <DeleteIcon />,
      },
      {
        id: 'export',
        label: 'Exportar',
        icon: <FileUploadIcon />,
      },
    ],
    actionIcons: [
      {
        id: 'visibility',
        activeIcon: <VisibilityIcon />,
        inactiveIcon: <VisibilityOffIcon color="disabled" />,
      },
    ],
    isLargeSize: false,
  },
};

export const Device = {
  render: DeviceTemplate,

  args: {
    ...Default.args,
  },
};

export const DeviceWithHeader = {
  render: DeviceWithHeaderTemplate,

  args: {
    ...Default.args,
  },
};
