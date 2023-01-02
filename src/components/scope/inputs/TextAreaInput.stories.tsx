import React from 'react';
import {Meta, Story} from '@storybook/react';

import TextAreaInput, {TextAreaInputProps} from './TextAreaInput';
import {v4 as uuidv4} from 'uuid';

export default {
  title: 'Scope/Inputs/TextAreaInput',
  component: TextAreaInput
} as Meta;

const Template: Story<TextAreaInputProps> = args => <TextAreaInput {...args}/>;

export const Default = Template.bind({});
Default.args = {
  isEditing: true,
  feature: {
    type: 'Feature',
    id: uuidv4(),
    geometry: {
      type: 'Point',
      coordinates: [40.4125, -3.6897, 1225]
    },
    properties: {
      name: 'C',
      color: undefined,
      timestamp: Date.now(),
      description: 'Había un árbol con el tronco torcido en medio del camino.',
      images: [...Array(3).keys()].map(i => ({
        id: uuidv4(),
        url: 'https://picsum.photos/300/200',
        name: `Imagen ${i}`,
        contentType: 'image/jpg',
        isLoading: Math.random() < 0.1,
      })),
      isVisible: true
    }
  },
  sx: {
    '&.GenericInput-wrapper': {
      padding: '8px',
      marginBottom: '0px'
    },
    '& .GenericInput-title': {
      color: 'grey.600',
    }
  }
};