import React from 'react';
import EntityList, {EntityListProps} from './EntityList';
import {Meta, Story} from '@storybook/react';

//MUI
import Box from '@mui/material/Box';

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
import ManagerHeader from './ManagerHeader';

//UTILS
import {DRAWER_WIDTH} from '../../config';
import {v4 as uuidv4} from 'uuid';

export default {
  title: 'Common/EntityList',
  component: EntityList
} as Meta;

const Template: Story<EntityListProps> = args => <EntityList {...args}/>;
const DeviceTemplate: Story<EntityListProps> = args => <Box
  sx={{width: DRAWER_WIDTH, height: 844, boxShadow: 3}}><EntityList {...args}/></Box>;
    
const DeviceEntityTemplate: Story<EntityListProps> = args => <Box
  sx={{width: DRAWER_WIDTH, height: 844, boxShadow: 3}}>
  <ManagerHeader name='Ámbitos' color='#1b718c' startIcon={<FolderIcon sx={{color: theme => theme.palette.getContrastText('#fc5252')}}/>}/>
  <EntityList {...args}/>
</Box>;

export const Scope = Template.bind({});
Scope.args = {
  entities: [
    {
      id: uuidv4(),
      name: 'Mi Ámbito 01',
      color: '#247a44',
      isActive: true,
    },
    {
      id: uuidv4(),
      name: 'Mi Ámbito 02',
      color: '#fc5252',
      isActive: true,
    },
    {
      id: uuidv4(),
      name: 'Mi Ámbito 03',
      color: '#f5017a',
      isActive: true,
    },
  ],
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
  activeActionIcon: <FileUploadIcon/>,
};

export const Empty = Template.bind({});
Empty.args = {
  ...Scope.args,
  entities: [],
};

export const Point_Path = Template.bind({});
Point_Path.args = {
  entities: [
    {
      id: uuidv4(),
      name: 'Mi Punto o Traza 01',
      color: '#247a44',
      isActive: true
    },
    {
      id: uuidv4(),
      name: 'Mi Punto o Traza 02',
      color: '#fc5252',
      isActive: false
    },
    {
      id: uuidv4(),
      name: 'Mi Punto o Traza 03',
      color: '#f5017a',
      isActive: true
    },
  ],
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
  activeActionIcon:  <VisibilityIcon/>,
  inactiveActionIcon:  <VisibilityOffIcon/>,
};

export const Device = DeviceTemplate.bind({});
Device.args = {
  ...Scope.args
};

export const DeviceWithHeader = DeviceEntityTemplate.bind({});
DeviceWithHeader.args = {
  ...Scope.args
};