import React from 'react';
import {Meta, Story} from '@storybook/react';

import Thumbnail, {ThumbnailProps} from './Thumbnail';

export default {
  title: 'Common/Thumbnail',
  component: Thumbnail
} as Meta;

const Template: Story<ThumbnailProps> = args => <Thumbnail {...args}/>;

export const Default = Template.bind({});
Default.args = {
  image: 'https://picsum.photos/300/200',
  isDeletable: false
};

export const Loading = Template.bind({});
Loading.args = {
  image: 'https://picsum.photos/300/200',
  isDeletable: false
};

export const Deletable = Template.bind({});
Deletable.args = {
  image: 'https://picsum.photos/300/200',
  isDeletable: true
};
