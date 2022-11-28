import React from 'react';
import {Meta, Story} from '@storybook/react';

import PointPanel, {PointPanelProps} from './PointPanel';

export default {
  title: 'Scope/PointPanel',
  component: PointPanel
} as Meta;

const Template: Story<PointPanelProps> = args => <PointPanel {...args}/>;

export const Default = Template.bind({});
Default.args = {
};
