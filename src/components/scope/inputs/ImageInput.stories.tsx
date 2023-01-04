import React from 'react';
import {Meta, Story} from '@storybook/react';

import ImageInput, {ImageInputProps} from './ImageInput';
import {v4 as uuidv4} from 'uuid';

export default {
  title: 'Scope/Inputs/ImageInput',
  component: ImageInput
} as Meta;

const Template: Story<ImageInputProps> = args => <ImageInput {...args}/>;

export const Default = Template.bind({});
Default.args = {
  images: [...Array(3).keys()].map(i => ({
    path: 'https://picsum.photos/300/200',
    name: `Imagen ${i}`
  }))
};