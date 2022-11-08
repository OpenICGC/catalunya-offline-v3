import React from 'react';
import FabButton from './FabButton';

export default {
  title: 'Common/FabButton',
  component: FabButton,
  argTypes: {
    bearing: {
      control: {
        type: 'number',
        min: 0,
        max: 359,
        step: 1
      }
    }
  }
};

const Template = args => <FabButton {...args}/>;

export const Default = Template.bind({});
Default.args = {
  bearing: 0,
  isLocationAvailable: true,
  isCompassOn: false,
  isTrackingOn: false,
  isLeftHanded: false,
  isAccessibleSize: false,
};

export const Bearing30 = Template.bind({});
Bearing30.args = {
  ...Default.args,
  bearing: 30,
  isCompassOn: true
};

export const LocationUnavailable = Template.bind({});
LocationUnavailable.args = {
  ...Default.args,
  isLocationAvailable: false,
};

export const LocationOn = Template.bind({});
LocationOn.args = {
  ...Default.args,
  isTrackingOn: true
};

export const LeftHanded = Template.bind({});
LeftHanded.args = {
  ...Default.args,
  isLeftHanded: true
};

export const Accessible = Template.bind({});
Accessible.args = {
  ...Default.args,
  isAccessibleSize: true
};