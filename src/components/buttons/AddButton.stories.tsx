import React from 'react';
import AddButton, {AddButtonProps} from './AddButton';
import {Meta, Story} from '@storybook/react';

//MUI-ICONS
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';

import AddTrack from '../icons/AddTrack';

export default {
  title: 'Buttons/AddButton',
  component: AddButton,
} as Meta;

const Template: Story<AddButtonProps> = args => <AddButton {...args}/>;

export const Scope = Template.bind({});
Scope.args = {
  children: <CreateNewFolderIcon/>
};

export const Point = Template.bind({});
Point.args = {
  ...Scope.args,
  children: <AddLocationAltIcon/>
};

export const Track = Template.bind({});
Track.args = {
  ...Scope.args,
  children: <AddTrack/>
};

