import React from 'react';
import {Meta, Story} from '@storybook/react';

import SettingsView from './SettingsView';

export default {
  title: 'Common/SettingsView',
  component: SettingsView
} as Meta;

const Template: Story = args => <SettingsView {...args}/>;

export const Default = Template.bind({});
Default.args = {
};
