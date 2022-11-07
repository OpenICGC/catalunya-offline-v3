import React from 'react';
import FabButton from './FabButton';

export default {
  title: 'Common/FabButton',
  component: FabButton
};

const Template = args => <FabButton {...args}/>;

export const Default = Template.bind({});
Default.args = {
  leftHanded: false
};

export const LeftHanded = Template.bind({});
LeftHanded.args = {
  leftHanded: true
};
