import React from 'react';
import AddButton, {AddButtonProps} from './AddButton';
import {Meta, Story} from '@storybook/react';

//MUI-ICONS
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';

import AddPath from '../icons/AddPath';

export default {
  title: 'Buttons/AddButton',
  component: AddButton,
} as Meta;

const Template: Story<AddButtonProps> = args => <AddButton {...args}/>;

export const Scope = Template.bind({});
Scope.args = {
  isAccessibleSize: false,
  isLeftHanded: false,
  children: <CreateNewFolderIcon/>
};

export const Point = Template.bind({});
Point.args = {
  ...Scope.args,
  children: <AddLocationAltIcon/>
};

export const Path = Template.bind({});
Path.args = {
  ...Scope.args,
  children: <AddPath/>
};

