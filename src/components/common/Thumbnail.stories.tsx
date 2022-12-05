import React from 'react';
import {Meta, Story} from '@storybook/react';

import Thumbnail, {ThumbnailProps} from './Thumbnail';
import {v4 as uuidv4} from 'uuid';

export default {
  title: 'Common/Thumbnail',
  component: Thumbnail
} as Meta;

const Template: Story<ThumbnailProps> = args => <Thumbnail {...args}/>;

export const Default = Template.bind({});
Default.args = {
  image: {
    id: uuidv4(),
    url: 'https://picsum.photos/300/200',
    name: 'image.jpg',
    contentType: 'image/jpg',
    isLoading: false,
  },
  isDeletable: false
};

export const Loading = Template.bind({});
Loading.args = {
  image: {
    id: uuidv4(),
    url: 'https://picsum.photos/300/200',
    name: 'image.jpg',
    contentType: 'image/jpg',
    isLoading: true,
  },
  isDeletable: false
};

export const Deletable = Template.bind({});
Deletable.args = {
  image: {
    id: uuidv4(),
    url: 'https://picsum.photos/300/200',
    name: 'image.jpg',
    contentType: 'image/jpg',
    isLoading: false
  },
  isDeletable: true
};