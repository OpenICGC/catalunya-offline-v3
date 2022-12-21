import React from 'react';
import {Meta, Story} from '@storybook/react';

import TrackRecButton, {TrackRecButtonProps} from './TrackRecButton';

export default {
  title: 'Buttons/TrackRecButton',
  component: TrackRecButton
} as Meta;

const Template: Story<TrackRecButtonProps> = args => <TrackRecButton {...args}/>;

export const Default = Template.bind({});
Default.args = {
  isAccessibleSize: false
};