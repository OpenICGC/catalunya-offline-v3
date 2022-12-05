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
import {UUID} from '../../types/commonTypes';

export default {
  title: 'Scope/ListItem',
  component: ListItem
} as Meta;

const Template: Story<ListItemProps> = args => <ListItem {...args}/>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ManagedTemplate: Story<ListItemProps> = ({isEditing, color, name, isActive, onColorChange, onNameChange, onActionClick, onContextualMenuClick, onStopEditing, ...args }) => {
  const [getEditing, setEditing] = useState(isEditing);
  const [getColor, setNewColor] = useState(color);
  const [getName, setNewName] = useState(name);
  const [getActive, setActive] = useState(isActive);

  const handleContextualMenuClick = (id: UUID, action: string) => {
    console.log(id, action);
    if (action == 'edit') {
      setEditing(true);
    }
  };

  return <ListItem
    isEditing={getEditing}
    onContextualMenuClick={handleContextualMenuClick}
    onStopEditing={() => setEditing(false)}
    color={getColor}
    onColorChange={(id, value) => setNewColor(value)}
    name={getName}
    onNameChange={(id, value) => setNewName(value)}
    isActive={getActive}
    onActionClick={() => setActive(!getActive)}
    {...args} />;
};

const ListTemplate: Story<ListItemProps> = args => <List><ListItem {...args}/><ListItem {...args}/><ListItem {...args}/><ListItem {...args}/></List>;

export const Default = Template.bind({});
Default.args = {
  itemId: uuidv4(),
  name: 'Mi Ámbito, Punto o Traza',
  color: '#247a44',
  isActive: true,
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
  isEditing: true
};

export const Error = Template.bind({});
Error.args = {
  ...Default.args,
  name: '',
  isEditing: true
};

export const Managed = ManagedTemplate.bind({});
Managed.args = {
  ...Default.args
};

export const InAList = ListTemplate.bind({});
InAList.args = {
  ...Default.args
};

export const PointDetail = Template.bind({});
PointDetail.args = {
  ...Default.args,
  name: 'Mi punto',
  contextualMenu: undefined,
  actionIcons: [
    {
      id: 'rename',
      activeIcon: <EditIcon/>,
    },
    {
      id: 'goTo',
      activeIcon: <SwipeRightAltIcon/>,
    }
  ],
};