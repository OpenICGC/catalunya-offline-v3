import React from 'react';
import {Meta, Story} from '@storybook/react';
import RecordButton, {RecordButtonProps} from './RecordButton';

export default {
  title: 'Buttons/RecordButton',
  component: RecordButton
} as Meta;

const Template: Story<RecordButtonProps> = args => <RecordButton {...args}/>;

export const Default = Template.bind({});
Default.args = {};