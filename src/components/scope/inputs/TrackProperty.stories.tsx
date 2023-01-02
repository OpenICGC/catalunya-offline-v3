import React from 'react';
import {Meta, Story} from '@storybook/react';
import TrackProperty, {TrackPropertyProps} from './TrackProperty';

import StraightenIcon from '@mui/icons-material/Straighten';

export default {
  title: 'Scope/Inputs/TrackProperty',
  component: TrackProperty
} as Meta;

const Template: Story<TrackPropertyProps> = args => <TrackProperty {...args}/>;

export const Default = Template.bind({});
Default.args = {
  icon: <StraightenIcon/>,
  value: '16.9km'
};

export const NoValue = Template.bind({});
NoValue.args = {
  icon: <StraightenIcon/>
};