import React from 'react';
import {Meta, Story} from '@storybook/react';

import LocationMarker, {LocationMarkerProps} from './LocationMarker';

export default {
  title: 'Map/LocationMarker',
  component: LocationMarker,
  argTypes: {
    bearing: {
      control: { type: 'range', min: 0, max: 359, step: 1}
    },
    bearingAccuracy: {
      control: { type: 'range', min: 0, max: 359, step: 1}
    }
  }
} as Meta;

const Template: Story<LocationMarkerProps> = args => <LocationMarker {...args}/>;

export const Default = Template.bind({});
Default.args = {
  bearing: 30,
  bearingAccuracy: 75,
  isStale: false
};

export const Stale = Template.bind({});
Stale.args = {
  bearing: 30,
  bearingAccuracy: 75,
  isStale: true
};

export const NoBearing = Template.bind({});
NoBearing.args = {
  isStale: false
};
