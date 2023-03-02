import React from 'react';
import {Meta, Story} from '@storybook/react';

import OutOfTrackButton from './OutOfTrackButton';

export default {
  title: 'Buttons/OutOfTrackButton',
  component: OutOfTrackButton
} as Meta;

const Template: Story = args => <OutOfTrackButton {...args}/>;

export const Default = Template.bind({});
Default.args = {};