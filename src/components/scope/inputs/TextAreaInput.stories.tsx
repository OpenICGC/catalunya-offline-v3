import React from 'react';
import {Meta, Story} from '@storybook/react';

import TextAreaInput, {TextAreaInputProps} from './TextAreaInput';

export default {
  title: 'Scope/Inputs/TextAreaInput',
  component: TextAreaInput
} as Meta;

const Template: Story<TextAreaInputProps> = args => <TextAreaInput {...args}/>;

export const Default = Template.bind({});
Default.args = {
  isEditing: true,
  text: 'Había un árbol con el tronco torcido en medio del camino.',
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