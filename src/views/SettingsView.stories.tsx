import React from 'react';
import {Meta, Story} from '@storybook/react';

import SettingsView, {SettingsViewProps} from './SettingsView';

export default {
  title: 'Common/SettingsView',
  component: SettingsView
} as Meta;

const Template: Story<SettingsViewProps> = args => <SettingsView {...args}/>;

export const Default = Template.bind({});
Default.args = {
};
