import React from 'react';
import DownloadRequest from './DownloadRequest';

export default {
  title: 'Notifications/DownloadRequest',
  component: DownloadRequest
};

const Template = args => <DownloadRequest {...args}/>;

export const Default = Template.bind({});
Default.args = {
  isOpen: true
};
