import React from 'react';
import DownloadProgress from './DownloadProgress';

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
};

const Template = args => <DownloadProgress {...args}/>;

export const Default = Template.bind({});
Default.args = {
  progress: 60,
  isOpen: true
};
