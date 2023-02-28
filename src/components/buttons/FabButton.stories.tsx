import React from 'react';
import FabButton, {FabButtonProps, LOCATION_STATUS} from './FabButton';
import {Meta, Story} from '@storybook/react';

export default {
  title: 'Buttons/FabButton',
  component: FabButton,
  argTypes: {
    bearing: {
      control: {
        type: 'range',
        min: 0,
        max: 359,
        step: 1
      }
    },
    pitch: {
      control: {
        type: 'range',
        min: 0,
        max: 80,
        step: 1
      }
    },
    locationStatus: {
      options: {
        DISABLED: 0,
        NOT_TRACKING: 1,
        TRACKING: 2,
        NAVIGATING: 3
      },
      type: 'inline-radio'
    }
  }
} as Meta;

const Template: Story<FabButtonProps> = args => <FabButton {...args}/>;

export const Default = Template.bind({});
Default.args = {
  isLeftHanded: false,
  isAccessibleSize: false,
  isFabOpen: true,
  bearing: 0,
  pitch: 0,
  locationStatus: LOCATION_STATUS.NOT_TRACKING
};

export const Bearing30 = Template.bind({});
Bearing30.args = {
  ...Default.args,
  bearing: 30,
};

export const LocationDisabled = Template.bind({});
LocationDisabled.args = {
  ...Default.args,
  locationStatus: LOCATION_STATUS.DISABLED
};

export const Tracking = Template.bind({});
Tracking.args = {
  ...Default.args,
  locationStatus: LOCATION_STATUS.TRACKING
};

export const Navigating = Template.bind({});
Navigating.args = {
  ...Default.args,
  locationStatus: LOCATION_STATUS.NAVIGATING
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