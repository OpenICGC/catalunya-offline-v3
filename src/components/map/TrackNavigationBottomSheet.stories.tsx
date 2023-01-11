import React from 'react';
import {Meta, Story} from '@storybook/react';

import TrackNavigationBottomSheet, {TrackNavigationBottomSheetProps} from './TrackNavigationBottomSheet';
import sample from '../scope/inputs/sampleLineString.geo.json';
import sampleWithoutHeight from '../scope/inputs/sampleLineStringWithoutHeight.geo.json';
const sampleGeometry: GeoJSON.LineString = sample as GeoJSON.LineString;
const sampleGeometryWithoutHeight: GeoJSON.LineString = sampleWithoutHeight as GeoJSON.LineString;
import {v4 as uuid} from 'uuid';

export default {
  title: 'Map/TrackNavigationBottomSheet',
  component: TrackNavigationBottomSheet,
  argTypes: {
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
  track: {
    type: 'Feature',
    id: uuid(),
    properties: {
      name: 'Mi traza 01',
      timestamp: Date.now(),
      description: 'Excursión con amigos de la infancia',
      images: [...Array(3).keys()].map(i => `https://picsum.photos/300/20${i}`),
      color: '#973572',
      isVisible: true
    },
    geometry: sampleGeometry
  },
  currentPositionIndex: 24,
  isOutOfTrack: false,
  isReverseDirection: false
};

export const WithoutHeight = Template.bind({});
WithoutHeight.args = {
  ...Default.args,
  track: {
    type: 'Feature',
    id: uuid(),
    properties: {
      name: 'Mi traza 01',
      timestamp: Date.now(),
      description: 'Excursión con amigos de la infancia',
      images: [...Array(3).keys()].map(i => `https://picsum.photos/300/20${i}`),
      color: '#973572',
      isVisible: true
    },
    geometry: sampleGeometryWithoutHeight
  },
};
