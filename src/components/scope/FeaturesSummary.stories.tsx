import React from 'react';
import {Meta, Story} from '@storybook/react';

import FeaturesSummary, {FeaturesSummaryProps} from './FeaturesSummary';

export default {
  title: 'Scope/FeaturesSummary',
  component: FeaturesSummary,
  argTypes: {
    colorContrastFrom: {control: 'color'}
  }
} as Meta;

const Template: Story<FeaturesSummaryProps> = args => <FeaturesSummary {...args}/>;

export const Default = Template.bind({});
Default.args = {
  numPoints: 17,
  numTracks: 5,
  colorContrastFrom: '#ffffff'
};