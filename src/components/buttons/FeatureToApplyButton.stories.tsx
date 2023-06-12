import React from 'react';
import {Meta, Story} from '@storybook/react';

import FeatureToApplyButton, {FEATURE_APPLIED, FeatureToApplyButtonProps} from './FeatureToApplyButton';

export default {
  title: 'Buttons/FeatureToApplyButton',
  component: FeatureToApplyButton,
  argTypes: {
    feature: {
      options: {
        POINT: FEATURE_APPLIED.POINT,
        TRACK: FEATURE_APPLIED.TRACK
      },
      control: { type: 'inline-radio' },
    },
  }
} as Meta;

const Template: Story<FeatureToApplyButtonProps> = args => <FeatureToApplyButton {...args}/>;

export const Default = Template.bind({});
Default.args = {
  isSelected: true,
  feature: FEATURE_APPLIED.POINT
};