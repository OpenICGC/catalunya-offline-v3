import React from 'react';
import {Meta, Story} from '@storybook/react';

import GeometryThumbnail, {GeometryThumbnailProps} from './GeometryThumbnail';
import GeoJSON from 'geojson';
import sample from '../fixtures/sampleLineString.geojson';
const sampleGeometry: GeoJSON.LineString = JSON.parse(sample) as GeoJSON.LineString;

export default {
  title: 'Scope/Inputs/GeometryThumbnail',
  component: GeometryThumbnail,
  argTypes: {
    color: {
      control: 'color'
    },
    size: {
      control: { type: 'range', min: 16, max: 512, step: 1}
    }
  }
} as Meta;

const Template: Story<GeometryThumbnailProps> = args => <GeometryThumbnail {...args}/>;

export const Default = Template.bind({});
Default.args = {
  geometry: sampleGeometry
};