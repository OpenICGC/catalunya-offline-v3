import React from 'react';
import {Meta, Story} from '@storybook/react';

import PathPanel, {PathPanelProps} from './PathPanel';

export default {
  title: 'Scope/PathPanel',
  component: PathPanel
} as Meta;

const Template: Story<PathPanelProps> = args => <PathPanel {...args}/>;

export const Default = Template.bind({});
Default.args = {
};
