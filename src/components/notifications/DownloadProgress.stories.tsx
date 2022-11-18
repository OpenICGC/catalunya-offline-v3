import React from 'react';
import DownloadProgress, {DownloadProgressProps} from './DownloadProgress';
import {Meta, Story} from '@storybook/react';

export default {
  title: 'Notifications/DownloadProgress',
  component: DownloadProgress,
  argTypes: {
    progress: {
      control: {
        type: 'range',
        min: 0,
        max: 100,
        step: 1
      }
    }
  }
} as Meta;

const Template: Story<DownloadProgressProps> = (args) => <DownloadProgress{...args}/>;

export const Default = Template.bind({});
Default.args = {
  progress: 60,
  isOpen: true
};
