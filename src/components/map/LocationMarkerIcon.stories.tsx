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
    }
  }
} as Meta;

const Template: Story<LocationMarkerIconProps> = args => <LocationMarkerIcon {...args}/>;

export const Default = Template.bind({});
Default.args = {
  heading: 30,
  headingAccuracy: 75,
  isStale: false
};

export const Stale = Template.bind({});
Stale.args = {
  heading: 30,
  headingAccuracy: 75,
  isStale: true
};

export const NoHeading = Template.bind({});
NoHeading.args = {
  isStale: false
};
