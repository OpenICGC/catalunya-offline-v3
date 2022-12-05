import React, {useState} from 'react';
import ListItem, {ListItemProps} from './ListItem';
import {Meta, Story} from '@storybook/react';

//MUI
import List from '@mui/material/List';

//MUI-ICONS
import DashboardIcon from '@mui/icons-material/Dashboard';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

//UTILS
import {v4 as uuidv4} from 'uuid';
import SwipeRightAltIcon from '@mui/icons-material/SwipeRightAlt';

export default {
  title: 'Scope/ListItem',
  component: ListItem
} as Meta;

const Template: Story<ListItemProps> = args => <ListItem {...args}/>;
const TemplateList: Story<ListItemProps> = args => <List><ListItem {...args}/><ListItem {...args}/><ListItem {...args}/><ListItem {...args}/></List>;

export const Default = Template.bind({});
Default.args = {
  item: {
    id: uuidv4(),
    name: 'Mi Ámbito, Punto o Traza',
    color: '#247a44',
    isActive: true,
  },
  isEditing: false,
  actionIcons: [
    {
      id: 'visibility',
      activeIcon: <VisibilityIcon/>,
      inactiveIcon: <VisibilityOffIcon color='disabled'/>,
    }
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
  ]
};

export const Editing = Template.bind({});
Editing.args = {
  ...Default.args,
  item: {
    id: uuidv4(),
    name: 'Mi Ámbito, Punto o Traza',
    color: '#247a44',
    isActive: true,
  },
  isEditing: true
};

export const Error = Template.bind({});
Error.args = {
  ...Default.args,
  item: {
    id: uuidv4(),
    name: '',
    color: '#247a44',
    isActive: true,
  },
  isEditing: true
};

export const PointDetail = TemplateList.bind({});
PointDetail.args = {
  item: {
    id: uuidv4(),
    name: 'Mi Punto',
    color: '#247a44',
    isActive: true,
  },
  isEditing: false,
  actionIcons: [
    {
      id: 'rename',
      activeIcon: <EditIcon/>,
    },
    {
      id: 'goto',
      activeIcon: <SwipeRightAltIcon/>,
    }
  ]
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ManagedTemplate: Story<ListItemProps> = ({item, onColorChange, onNameChange, onActionClick, ...args}) => {
  const [getColor, setNewColor] = useState(item.color);
  const [getName, setNewName] = useState(item.name);
  const [getActive, setActive] = useState(item.isActive);
  const computedItem = {...item, color: getColor, name: getName, isActive: getActive};
  return <ListItem
    item={computedItem}
    onColorChange={setNewColor}
    onNameChange={setNewName}
    onActionClick={() => setActive(!computedItem.isActive)}
    {...args} />;
};

export const Managed = ManagedTemplate.bind({});
Managed.args = {
  ...Default.args
};

export const Grouped = TemplateList.bind({});
Grouped.args = {
  ...Default.args
};


