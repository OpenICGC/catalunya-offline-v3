import React, {useCallback, useState} from 'react';
import List, {ListProps} from './List';
import {Meta, Story} from '@storybook/react';

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
import ManagerHeader from '../common/ManagerHeader';

//UTILS
import {DRAWER_WIDTH} from '../../config';
import {v4 as uuidv4} from 'uuid';
import useColorRamp from '@geomatico/geocomponents/hooks/useColorRamp';
import {HEXColor, UUID} from '../../types/commonTypes';
import {listItemType} from './ListItem';

const stackSx = {
  height: '500px',
  width: DRAWER_WIDTH,
  boxShadow: 3,
  overflow: 'hidden',
  m: 0,
  p: 0
};

export default {
  title: 'Scope/List',
  component: List
} as Meta;

const Template: Story<ListProps> = args => <List {...args}/>;

const DeviceTemplate: Story<ListProps> = args => <Stack sx={stackSx}><List {...args}/></Stack>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ManagedTemplate: Story<ListProps> = ({items, onNameChange, onColorChange, ...args}) => {
  const [getItems, setItems] = useState<Array<listItemType>>(items);

  const handleColorChange = useCallback((color: HEXColor, itemId: UUID) => setItems(
    prevItems => prevItems.map(item => item.id === itemId ? {...item, color} : item)
  ), []);

  const handleNameChange = useCallback((name: string, itemId: UUID) => setItems(
    prevItems => prevItems.map(item => item.id === itemId ? {...item, name} : item)
  ), []);

  return <Stack sx={stackSx}>
    <List
      items={getItems}
      onColorChange={handleColorChange}
      onNameChange={handleNameChange}
      {...args}
    />
  </Stack>;
};

const DeviceWithHeaderTemplate: Story<ListProps> = args => <Stack sx={stackSx}>
  <ManagerHeader name="Ámbitos" color="#1b718c" startIcon={<FolderIcon/>}/>
  <List {...args}/>
</Stack>;

const palette = useColorRamp('BrewerOranges4').hexColors;

export const Scope = Template.bind({});
Scope.args = {
  items: [...Array(3).keys()].map(i => ({
    id: uuidv4(),
    name: `Mi ámbito ${i}`,
    color: Math.random() < 0.5 ? palette[i % palette.length] : undefined, // Color asignado la mitad de las veces
    isActive: true,
  })),
  contextualMenu: [
    {
      id: 'rename',
      label: 'Renombrar',
      icon: <EditIcon/>
    },
    {
      id: 'delete',
      label: 'Borrar',
      icon: <DeleteIcon/>
    },
    {
      id: 'instamaps',
      label: 'Instamaps',
      icon: <MoreHorizIcon/>
    },
    {
      id: 'dataSchema',
      label: 'Esquema de datos',
      icon: <DashboardIcon/>
    }
  ],
  actionIcons: [
    {
      id: 'export',
      activeIcon: <FileUploadIcon/>
    }
  ],
  isAccessibleSize: false
};

export const Managed = ManagedTemplate.bind({});
Managed.args = {
  ...Scope.args
};

export const Empty = Template.bind({});
Empty.args = {
  ...Scope.args,
  items: []
};

export const Point_Path = Template.bind({});
Point_Path.args = {
  items: [...Array(3).keys()].map(i => ({
    id: uuidv4(),
    name: `Mi punto o traza ${i}`,
    color: Math.random() < 0.5 ? palette[i % palette.length] : undefined, // Color asignado la mitad de las veces
    isActive: Math.random() < 0.5
  })),
  contextualMenu: [
    {
      id: 'goTo',
      label: 'Ir a',
      icon: <SwipeRightAltIcon/>
    },
    {
      id: 'edit',
      label: 'Editar',
      icon: <EditIcon/>
    },
    {
      id: 'delete',
      label: 'Borrar',
      icon: <DeleteIcon/>
    },
    {
      id: 'export',
      label: 'Exportar',
      icon: <FileUploadIcon/>
    }
  ],
  actionIcons: [
    {
      id: 'visibility',
      activeIcon: <VisibilityIcon/>,
      inactiveIcon: <VisibilityOffIcon color='disabled'/>,
    }
  ],
  isAccessibleSize: false
};

export const Device = DeviceTemplate.bind({});
Device.args = {
  ...Scope.args
};

export const DeviceWithHeader = DeviceWithHeaderTemplate.bind({});
DeviceWithHeader.args = {
  ...Scope.args
};

export const OverflowItems = Device.bind({});
OverflowItems.args = {
  ...Scope.args,
  items: [...Array(20).keys()].map(i => ({
    id: uuidv4(),
    name: `Mi punto o traza ${i}`,
    color: Math.random() < 0.5 ? palette[i % palette.length] : undefined, // Color asignado la mitad de las veces
    isActive: Math.random() < 0.5,
  })),
};
