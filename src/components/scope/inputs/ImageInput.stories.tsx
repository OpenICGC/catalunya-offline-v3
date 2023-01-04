import React from 'react';
import {Meta, Story} from '@storybook/react';

import ImageInput, {ImageInputProps} from './ImageInput';

export default {
  title: 'Scope/Inputs/ImageInput',
  component: ImageInput
} as Meta;

const Template: Story<ImageInputProps> = args => <ImageInput {...args}/>;

export const Default = Template.bind({});
Default.args = {
  images: [...Array(3).keys()].map(i => `https://picsum.photos/300/20${i}`)
};