import React, {useState} from 'react';
import EntityListItem from './EntityListItem';

import FileUploadIcon from '@mui/icons-material/FileUpload';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

export default {
  title: 'Scope/EntityListItem',
  component: EntityListItem
};

const Template = args => <EntityListItem {...args}/>;
const TemplateList = args => <><EntityListItem {...args}/><EntityListItem {...args}/><EntityListItem {...args}/><EntityListItem {...args}/></>;

export const Default = Template.bind({});
Default.args = {
  actionIcon: <FileUploadIcon/>,
  color: '#247a44',
  id: 12525,
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
  ],
  name: 'Montseny'
};

// eslint-disable-next-line react/prop-types,no-unused-vars
const ManagedTemplate = ({color, onColorChange, name, onNameChange, ...args}) => {
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