import React from 'react';
import {Meta, Story} from '@storybook/react';

import TrackNavigationBottomSheet, {TrackNavigationBottomSheetProps} from './TrackNavigationBottomSheet';
import sample from '../scope/inputs/sampleLineString.geo.json';
const sampleGeometry: GeoJSON.LineString = sample as GeoJSON.LineString;

export default {
  title: 'Map/TrackNavigationBottomSheet',
  component: TrackNavigationBottomSheet,
  argTypes: {
    color: {control: 'color'},
    currentPositionIndex: {
      control: {
        type: 'range',
        min: 0,
        max: sampleGeometry && sampleGeometry.coordinates.length - 1,
        step: 1
      }
    }
  }
} as Meta;

const Template: Story<TrackNavigationBottomSheetProps> = args => <TrackNavigationBottomSheet {...args}/>;

export const Default = Template.bind({});
Default.args = {
  name: 'Track 01',
  color: '#973572',
  geometry: sampleGeometry,
  currentPositionIndex: 24,
  isOutOfTrack: false,
  isReverseDirection: false
};
export const OutOfTrack = Template.bind({});
OutOfTrack.args = {
  ...Default.args,
  isOutOfTrack: true
};