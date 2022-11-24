import React from 'react';
import DownloadRequest, {DownloadRequestProps} from './DownloadRequest';
import {Meta, Story} from '@storybook/react';

export default {
  title: 'Notifications/DownloadRequest',
  component: DownloadRequest
} as Meta;

const Template: Story<DownloadRequestProps> = args => <DownloadRequest {...args}/>;

export const Default = Template.bind({});
Default.args = {
  isOpen: true
};
