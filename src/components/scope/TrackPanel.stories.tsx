import React from 'react';
import {Meta, Story} from '@storybook/react';

import TrackPanel, {TrackPanelProps} from './TrackPanel';

export default {
  title: 'Scope/TrackPanel',
  component: TrackPanel
} as Meta;

const Template: Story<TrackPanelProps> = args => <TrackPanel {...args}/>;

export const Default = Template.bind({});
Default.args = {
};
