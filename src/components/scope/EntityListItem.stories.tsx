import React, {useState} from 'react';
import EntityListItem, {EntityListItemProps} from './EntityListItem';

import FileUploadIcon from '@mui/icons-material/FileUpload';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DashboardIcon from '@mui/icons-material/Dashboard';
import List from '@mui/material/List';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import {Meta, Story} from '@storybook/react';

export default {
  title: 'Scope/EntityListItem',
  component: EntityListItem
} as Meta;

const Template: Story<EntityListItemProps> = args => <EntityListItem {...args}/>;
const TemplateList: Story<EntityListItemProps> = args => <List><EntityListItem {...args}/><EntityListItem {...args}/><EntityListItem {...args}/><EntityListItem {...args}/></List>;

export const Default = Template.bind({});
Default.args = {
  actionIcon: <FileUploadIcon/>,
  color: '#247a44',
  id: 'bb7e8b18-6a37-11ed-a1eb-0242ac120002',
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
  name: 'Montseny'
};

// eslint-disable-next-line react/prop-types,no-unused-vars
const ManagedTemplate: Story<EntityListItemProps> = ({color, onColorChange, name, onNameChange, ...args}) => {
  const [newColor, setNewColor] = useState(color);
  const [newName, setNewName] = useState(name);
  return <EntityListItem
    onColorChange={setNewColor} color={newColor}
    onNameChange={setNewName} name={newName}
    {...args} />;
};

export const Managed = ManagedTemplate.bind({});
Managed.args = {
  ...Default.args
};

export const ListDefault = TemplateList.bind({});
ListDefault.args = {
  ...Default.args,
};