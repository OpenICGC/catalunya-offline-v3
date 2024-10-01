import React, { useState } from 'react';
import ListItem, { ListItemProps } from './ListItem';
import { StoryFn } from '@storybook/react';

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
import { v4 as uuidv4 } from 'uuid';
import SwipeRightAltIcon from '@mui/icons-material/SwipeRightAlt';
import { UUID } from '../../types/commonTypes';

export default {
  title: 'Scope/ListItem',
  component: ListItem,
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ManagedTemplate: StoryFn<ListItemProps> = ({isEditing, color, name, isVisible, onColorChange, onNameChange, onActionClick, onContextualMenuClick, onStopEditing, ...args}) => {
  const [getEditing, setEditing] = useState(isEditing);
  const [getColor, setNewColor] = useState(color);
  const [getName, setNewName] = useState(name);
  const [getVisibility, setVisibility] = useState(isVisible);

  const handleContextualMenuClick = (id: UUID, action: string) => {
    if (action == 'edit') {
      setEditing(true);
    }
  };

  return (
    <ListItem
      isEditing={getEditing}
      onContextualMenuClick={handleContextualMenuClick}
      onStopEditing={() => setEditing(false)}
      color={getColor}
      onColorChange={(id, value) => setNewColor(value)}
      name={getName}
      onNameChange={(id, value) => setNewName(value)}
      isVisible={getVisibility}
      onActionClick={() => setVisibility(!getVisibility)}
      {...args}
    />
  );
};

const ListTemplate: StoryFn<ListItemProps> = (args) => (
  <List>
    <ListItem {...args} />
    <ListItem {...args} />
    <ListItem {...args} />
    <ListItem {...args} />
  </List>
);

export const Default = {
  args: {
    itemId: uuidv4(),
    name: 'Mi Ámbito, Punto o Traza',
    color: '#247a44',
    isVisible: true,
    isEditing: false,
    actionIcons: [
      {
        id: 'visibility',
        activeIcon: <VisibilityIcon />,
        inactiveIcon: <VisibilityOffIcon color="disabled" />,
      },
    ],
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
  },
};

export const Editing = {
  args: {
    ...Default.args,
    isEditing: true,
  },
};

export const Error = {
  args: {
    ...Default.args,
    name: '',
    isEditing: true,
  },
};

export const Managed = {
  render: ManagedTemplate,

  args: {
    ...Default.args,
  },
};

export const InAList = {
  render: ListTemplate,

  args: {
    ...Default.args,
  },
};

export const PointDetail = {
  args: {
    ...Default.args,
    name: 'Mi punto',
    contextualMenu: undefined,
    actionIcons: [
      {
        id: 'rename',
        activeIcon: <EditIcon />,
      },
      {
        id: 'goTo',
        activeIcon: <SwipeRightAltIcon />,
        disabled: true,
      },
    ],
  },
};
