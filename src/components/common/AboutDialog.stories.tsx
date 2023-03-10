import React from 'react';
import {Meta, Story} from '@storybook/react';

import AboutDialog, {AboutDialogProps} from './AboutDialog';

export default {
  title: 'Common/AboutDialog',
  component: AboutDialog
} as Meta;

const Template: Story<AboutDialogProps> = args => <AboutDialog {...args}/>;

export const Default = Template.bind({});
Default.args = {

};