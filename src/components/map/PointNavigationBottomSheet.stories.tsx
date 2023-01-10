import React from 'react';
import {Meta, Story} from '@storybook/react';

import PointNavigationBottomSheet, {PointNavigationBottomSheetProps} from './PointNavigationBottomSheet';

export default {
  title: 'Map/PointNavigationBottomSheet',
  component: PointNavigationBottomSheet,
  argTypes: {
    color: {control: 'color'},
    course: {
      control: {
        type: 'range',
        min: 0,
        max: 359,
        step: 0.1
      }
    }
  }
} as Meta;

const Template: Story<PointNavigationBottomSheetProps> = args => <PointNavigationBottomSheet {...args}/>;

export const Default = Template.bind({});
Default.args = {
  name: 'Track 01',
  color: '#973572',
  course: 73.5,
  distance: 120
};