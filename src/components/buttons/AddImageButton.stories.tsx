import React from 'react';
import AddImageButton, {AddImageButtonProps} from './AddImageButton';
import {Meta, Story} from '@storybook/react';

//MUI-ICONS

export default {
  title: 'Buttons/AddImageButton',
  component: AddImageButton,
} as Meta;

const Template: Story<AddImageButtonProps> = args => <AddImageButton {...args}/>;

export const Default = Template.bind({});
Default.args = {
};

