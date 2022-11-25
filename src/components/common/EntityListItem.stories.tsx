import React, {useState} from 'react';
import EntityListItem, {EntityListItemProps} from './EntityListItem';
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

export default {
  title: 'Common/EntityListItem',
  component: EntityListItem
} as Meta;

const Template: Story<EntityListItemProps> = args => <EntityListItem {...args}/>;
const TemplateList: Story<EntityListItemProps> = args => <List><EntityListItem {...args}/><EntityListItem {...args}/><EntityListItem {...args}/><EntityListItem {...args}/></List>;

export const Default = Template.bind({});
Default.args = {
  entity: {
    id: uuidv4(),
    name: 'Mi Ámbito, Punto o Traza',
    color: '#247a44',
    isActive: true,
  },
  activeActionIcon: <VisibilityIcon/>,
  inactiveActionIcon: <VisibilityOffIcon color='disabled'/>,
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ManagedTemplate: Story<EntityListItemProps> = ({entity, onColorChange, onNameChange, onActionClick, ...args}) => {
  const [getColor, setNewColor] = useState(entity.color);
  const [getName, setNewName] = useState(entity.name);
  const [getActive, setActive] = useState(entity.isActive);
  const computedEntity = {...entity, color: getColor, name: getName, isActive: getActive};
  return <EntityListItem
    entity={computedEntity}
    onColorChange={setNewColor}
    onNameChange={setNewName}
    onActionClick={() => setActive(!computedEntity.isActive)}
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
