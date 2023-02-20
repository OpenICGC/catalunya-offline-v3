import React from 'react';
import {Meta, Story} from '@storybook/react';

import TrackProfile, {TrackProfileProps} from './TrackProfile';
import GeoJSON from 'geojson';

import sample from '../../fixtures/sampleLineString.geo.json';
const sampleGeometry: GeoJSON.LineString = sample as GeoJSON.LineString;

export default {
  title: 'Scope/Inputs/TrackProfile',
  component: TrackProfile,
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

const Template: Story<TrackProfileProps> = args => <TrackProfile {...args}/>;

export const Default = Template.bind({});
Default.args = {
  geometry: sampleGeometry,
  color: '#4d0330',
  currentPositionIndex: undefined,
  isOutOfTrack: false,
  isReverseDirection: false
};

export const Navigate = Template.bind({});
Navigate.args = {
  ...Default.args,
  currentPositionIndex: 17
};

export const NavigateOutOfTrack = Template.bind({});
NavigateOutOfTrack.args = {
  ...Default.args,
  currentPositionIndex: 17,
  isOutOfTrack: true
};

export const WithoutHeight = Template.bind({});
WithoutHeight.args = {
  ...Default.args,
  geometry: {
    type: 'LineString',
    coordinates: [[ 1.849509, 41.609283 ], [ 1.849479, 41.60926 ]],
  }
};

export const EmptyCoords = Template.bind({});
EmptyCoords.args = {
  ...Default.args,
  geometry: {
    type: 'LineString',
    coordinates: [],
  }
};

export const ZeroHeightAllPoints = Template.bind({});
ZeroHeightAllPoints.args = {
  ...Default.args,
  geometry: {
    type: 'LineString',
    coordinates: [[ 1.849509, 41.609283, 0 ], [ 1.849479, 41.60926, 0 ]],
  }
};

export const Error_NullGeometry = Template.bind({});
Error_NullGeometry.args = {
  ...Default.args,
  geometry: null
};

export const InvalidCoords = Template.bind({});
InvalidCoords.args = {
  ...Default.args,
  geometry: {
    type: 'LineString',
    coordinates: [[-250, 200, -50], [-200, 210, -55]],
  }
};

export const NavigateFirstIndex = Template.bind({});
NavigateFirstIndex.args = {
  geometry: sampleGeometry,
  color: '#973572',
  currentPositionIndex: 0
};

export const NavigateLastIndex = Template.bind({});
NavigateLastIndex.args = {
  geometry: sampleGeometry,
  color: '#973572',
  currentPositionIndex: sampleGeometry?.coordinates.length - 1
};

export const NavigateOutOfRange = Template.bind({});
NavigateOutOfRange.args = {
  geometry: sampleGeometry,
  color: '#973572',
  currentPositionIndex: 1000
};
