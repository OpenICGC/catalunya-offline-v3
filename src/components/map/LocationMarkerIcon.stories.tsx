import React from 'react';
import {Meta, Story} from '@storybook/react';

import LocationMarkerIcon, {LocationMarkerIconProps} from './LocationMarkerIcon';

export default {
  title: 'Map/LocationMarkerIcon',
  component: LocationMarkerIcon,
  argTypes: {
    heading: {
      control: { type: 'range', min: 0, max: 359, step: 1}
    },
    headingAccuracy: {
      control: { type: 'range', min: 0, max: 359, step: 1}
    },
    color: {control: 'color'}
  }
} as Meta;

const Template: Story<LocationMarkerIconProps> = args => <LocationMarkerIcon {...args}/>;

export const Default = Template.bind({});
Default.args = {
  heading: 30,
  headingAccuracy: 75,
  isStale: false,
  color: '#4286f5'
};

export const Stale = Template.bind({});
Stale.args = {
  ...Default.args,
  isStale: true
};

export const NoHeading = Template.bind({});
NoHeading.args = {
  ...Default.args,
  heading: undefined
};
