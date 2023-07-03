import React from 'react';
import {Meta, Story} from '@storybook/react';

import StorageProgress, {StorageProgressProps} from './StorageProgress';

export default {
  title: 'common/StorageProgress',
  component: StorageProgress,
  argTypes: {
    progress: {
      control: {type: 'range', min: 0, max: 100, step: 0.1}
    }
  }
} as Meta;

const Template: Story<StorageProgressProps> = args => <StorageProgress {...args}/>;

export const Default = Template.bind({});
Default.args = {
  progress: 38
};
